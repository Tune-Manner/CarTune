from fastapi import FastAPI
import speech_recognition as sr
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast

# KoBART 모델과 토크나이저 로드
model_name = 'hyunwoongko/kobart'
model = BartForConditionalGeneration.from_pretrained(model_name)
tokenizer = PreTrainedTokenizerFast.from_pretrained(model_name)

# FastAPI 설정
app = FastAPI()

# 텍스트 생성 함수
def generate_answer(input_text, max_length=50):
    input_ids = tokenizer.encode(input_text, return_tensors='pt')
    output_ids = model.generate(input_ids, max_length=max_length, num_beams=5, early_stopping=True)
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return output_text

def extract_intent_entity(input_text):
    intents = ["음악", "추천", "듣기", "찾기", "검색"]
    entities = ["장르", "시간", "장소", "가수", "노래", "앨범", "발매일", "차트", "인기", "신곡", "제목"]
    unnecessary_words = [
        "추천", "해줘", "부탁해", "주세요", "제발", "고마워", "감사합니다", "해", "줘",
        "좀", "할래", "줘요", "가", "입니다", "과", "그리고", "또는", "는", "이", "가", "를", "을", "에", "의", "와", "과", "에서", "로", "하다"
    ]

    words = input_text.split()
    filtered_words = [word for word in words if word not in unnecessary_words]
    filtered_text = " ".join(filtered_words)

    detected_intent = None
    detected_entities = []

    for intent in intents:
        if intent in filtered_text:
            detected_intent = intent
            break

    if detected_intent is None:
        if "?" in filtered_text:
            detected_intent = "질문"
        else:
            detected_intent = "명령"

    for entity in entities:
        if entity in filtered_text:
            detected_entities.append(entity)
    
    keywords = filtered_text.split()
    for keyword in keywords:
        if keyword not in detected_entities and keyword not in intents:
            detected_entities.append(keyword)

    return detected_intent, detected_entities

@app.post("/transcribe/")
async def transcribe_audio():
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("말씀하세요...")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)

        text = recognizer.recognize_google(audio, language='ko-KR')
        
        print("text:"+text)

        answer = generate_answer(text)
        intent, entities = extract_intent_entity(text)
        
        return {
            "text": text,
            "answer": answer,
            "intent": intent,
            "entities": entities
        }
    except sr.UnknownValueError:
        return {"error": "Google 음성 인식이 오디오를 이해하지 못했습니다."}
    except sr.RequestError as e:
        return {"error": f"Google 음성 인식 서비스 요청에 실패했습니다; {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
