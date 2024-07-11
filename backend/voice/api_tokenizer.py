from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast
from fastapi import FastAPI

# KoBART 모델과 토크나이저 로드
model_name = 'hyunwoongko/kobart'
model = BartForConditionalGeneration.from_pretrained(model_name)
tokenizer = PreTrainedTokenizerFast.from_pretrained(model_name)

# 텍스트 생성 함수
def generate_answer(input_text, max_length=50):
    # 입력 텍스트를 토큰화
    input_ids = tokenizer.encode(input_text, return_tensors='pt')

    # 모델을 사용하여 텍스트 생성
    output_ids = model.generate(input_ids, max_length=max_length, num_beams=5, early_stopping=True)

    # 생성된 텍스트를 디코딩
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return output_text

def extract_intent_entity(input_text):
    # 의도 및 엔터티 목록
    intents = ["음악", "추천", "듣기", "찾기", "검색"]
    entities = ["장르", "시간", "장소", "가수", "노래", "앨범", "발매일", "차트", "인기", "신곡", "제목"]
    unnecessary_words = [
        "추천", "해줘", "부탁해", "주세요", "제발", "고마워", "감사합니다", "해", "줘",
        "좀", "할래", "줘요", "가", "입니다", "과", "그리고", "또는", "는", "이", "가", "를", "을", "에", "의", "와", "과", "에서", "로", "하다"
    ]

    # 불필요한 단어 제거
    words = input_text.split()
    filtered_words = [word for word in words if word not in unnecessary_words]
    filtered_text = " ".join(filtered_words)

    detected_intent = None
    detected_entities = []

    # 의도 인식
    for intent in intents:
        if intent in filtered_text:
            detected_intent = intent
            break

    # 기본 의도 설정
    if detected_intent is None:
        if "?" in filtered_text:
            detected_intent = "질문"
        else:
            detected_intent = "명령"

    # 엔터티 인식
    for entity in entities:
        if entity in filtered_text:
            detected_entities.append(entity)
    
    # 추가적인 키워드 인식
    keywords = filtered_text.split()
    for keyword in keywords:
        if keyword not in detected_entities and keyword not in intents:
            detected_entities.append(keyword)

    return detected_intent, detected_entities
# FastAPI 설정
app = FastAPI()

@app.post("/qa/")
async def qa_endpoint(input_text: str):
    # 답변 생성
    answer = generate_answer(input_text)
    
    # 의도 및 엔터티 인식
    intent, entities = extract_intent_entity(input_text)
    
    return {
        "input_text": input_text,
        "answer": answer,
        "intent": intent,
        "entities": entities
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)