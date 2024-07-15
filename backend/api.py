from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import speech_recognition as sr
from transformers import BartForConditionalGeneration, PreTrainedTokenizerFast
from tensorflow.python.keras.models import load_model
from tensorflow import keras
from keras._tf_keras.keras.layers import BatchNormalization
from keras._tf_keras.keras.preprocessing.image import smart_resize, load_img, img_to_array
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from cryptography.fernet import Fernet
import numpy as np
import io
import pprint
from credentials.credentials import Encrypted_text2
import openai
import json
import torch
from ram.models import ram
from ram import inference_ram as inference
from ram import get_transform

# Import functions from music.py
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from music.music import (
    create_and_play_playlist,
    get_latest_playlist
)

base_dir = os.path.dirname(os.path.abspath(__file__))
with open((base_dir.replace("\\", "/") + "/credentials/encryption_key2.key"), "rb") as key_file:
    key = key_file.read()

cipher_suite = Fernet(key)

openai.api_key = cipher_suite.decrypt(Encrypted_text2).decode()

# FastAPI 설정
app = FastAPI()

#CORS 설정
origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# KoBART 모델과 토크나이저 로드
kobart_model_name = 'hyunwoongko/kobart'
kobart_model = BartForConditionalGeneration.from_pretrained(kobart_model_name)
kobart_tokenizer = PreTrainedTokenizerFast.from_pretrained(kobart_model_name)

# TensorFlow 모델 로드
weather_model = load_model("models/trainedModelE10.h5")
custom_objects = {'BatchNormalization': BatchNormalization}

# 모델 입력 형상 확인
input_shape = weather_model.input_shape[1:]

global_entities = None

# KoBART 텍스트 생성 함수
def generate_answer(input_text, max_length=50):
    input_ids = kobart_tokenizer.encode(input_text, return_tensors='pt')
    output_ids = kobart_model.generate(input_ids, max_length=max_length, num_beams=5, early_stopping=True)
    output_text = kobart_tokenizer.decode(output_ids[0], skip_special_tokens=True)
    return output_text

# KoBART 의도 및 엔티티 추출 함수
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
    global global_entities
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("말씀하세요...")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)

        text = recognizer.recognize_google(audio, language='ko-KR')
        print("text:" + text)

        # 여기에 generate_answer 및 extract_intent_entity 함수를 추가
        answer = generate_answer(text)
        intent, entities = extract_intent_entity(text)

        # 결과를 전역 변수에 저장
        global_entities = entities

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

@app.get("/get_entities/")
async def get_entities():
    global global_entities
    if global_entities is not None:
        return {"entities": global_entities}
    else:
        raise HTTPException(status_code=404, detail="No entities available")
    

# 이미지 전처리 함수
def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.resize((input_shape[0], input_shape[1]))  # 모델에 맞게 이미지 크기 조정
    image = np.array(image) / 255.0  # 이미지 정규화
    image = np.expand_dims(image, axis=0)  # 배치 차원 추가
    return image

# 이미지 예측 함수
def predict_image(image: np.ndarray) -> int:
    predictions = weather_model.predict(image)
    pprint.pprint(predictions)
    predicted_class = np.argmax(predictions, axis=1)[0]
    print(f"predicted_class : {int(predicted_class)}")
    return predicted_class

global_predicted_class = None

# 날씨 예측 엔드포인트
@app.post("/weather-predict/")
async def predict(file: UploadFile = File(...)):

    global global_predicted_class

    # 이미지 읽기 및 전처리
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    processed_image = preprocess_image(image)
    
    # 모델 예측
    predicted_class = int(predict_image(processed_image))

    global_predicted_class = predicted_class

    # class_dict = {0: "Rainy", 1: "Cloudy", 2: "Sunny", 3: "Snowy", 4: "Foggy"}
    # predicted_class = class_dict[predicted_class]
    
    # 예측 결과 반환
    return {
        "predicted_class": predicted_class
    }

# 모델 로드 및 설정
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
image_size = 384
transform = get_transform(image_size=image_size)
model = ram(pretrained=base_dir + '/models/ram_swin_large_14m.pth', image_size=image_size, vit='swin_l')
model.eval()
model = model.to(device)

@app.post("/inference/")
async def run_inference(file: UploadFile = File(...)):
    try:
        # 이미지 파일 읽기
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image = transform(image).unsqueeze(0).to(device)

        # 모델 추론
        res = inference(image, model)
        pprint.pprint(res)
        tags = res[0].split(" | ")
        global global_predicted_class
        global_predicted_class = ", ".join(tags)

        return JSONResponse(content={"tags": tags})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
@app.get("/get_predicted_class/")
async def get_predicted_class():
    global global_predicted_class
    if global_predicted_class is not None:
        return {"predicted_class": global_predicted_class}
    else:
        raise HTTPException(status_code=404, detail="No prediction available")

def gptPromptPreprocessing(weather):
    try:
        prompt = "{} 이 키워드들 중에서 날씨와 관련된 키워드 한개를 선택해줘. 반드시 영어로 아래 양식에 맞게 작성해줘.\n\
            {{\
            \t\"keyword\": \"{{}}\"\
            }}".format(weather)
        response = openai.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {
                    'role': 'user', 
                    'content': prompt
                },
            ],
            temperature=0.4
        )
        print('\nChatGPT is now generating answer 1 ...')
        print(response.choices[0].message.content)

    except Exception as e:
        print("OpenAI API Error!")
        print(f"에러 내용: \n{e}")
        return
    return response.choices[0].message.content
        

def gptPrompt(weather, atmosphere, keyword):
    try:
        prompt = "{} 분위기와 {} 취향에 맞는 음악 20개를 추천해줘. 반드시 영어로 아래 양식에 맞게 작성해줘.\n\
        {{\
        \t\"songs\": [\
        \t\t{{ \"title\": \"Spring Day\", \"artist\": \"BTS\" }},\
        \t\t{{ \"title\": \"Any Song\", \"artist\": \"Zico\" }},\
        \t\t{{ \"title\": \"DDU-DU DDU-DU\", \"artist\": \"BLACKPINK\" }},\
        \t\t{{ \"title\": \"Blueming\", \"artist\": \"IU\" }},\
        \t\t{{ \"title\": \"Cheer Up\", \"artist\": \"TWICE\" }},\
        \t\t{{ \"title\": \"LILAC\", \"artist\": \"IU\" }}\
        \t],\
        \t\"playlist_name\": \"{}_day_{}_playlist\"\
        }}".format(atmosphere, keyword, weather, keyword)

        response = openai.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[
                {
                    'role': 'user', 
                    'content': prompt
                },
            ],
            temperature=0.4
        )
        print('\nChatGPT is now generating answer 2 ...')

    except Exception as e:
        print("OpenAI API Error!")
        print(f"에러 내용: \n{e}")
        return
    return json.loads(response.choices[0].message.content)

@app.post("/create_and_play_playlist/")
async def create_playlist_endpoint():
    try:
        response_weather = await get_predicted_class()
        response_entities = await get_entities()

        predicted_class = response_weather['predicted_class']
        entities = response_entities['entities']

        # class_dict = {0: "", 1: "Rainy", 2: "Cloudy", 3: "Sunny", 4: "Snowy", 5: "Foggy"}
        # weather = class_dict.get(predicted_class, "Unknown")
        atmosphere = predicted_class
        print(f"predicted_class: {predicted_class}")
        keyword = " ".join(entities)

        weather = gptPromptPreprocessing(atmosphere)
        playlist_data = gptPrompt(weather, atmosphere, keyword)

        result = create_and_play_playlist(playlist_data)
        return result
    except HTTPException as e:
        return {"error": str(e)}

@app.get("/latest_playlist/")
async def latest_playlist_endpoint():
    try:
        result = get_latest_playlist()
        return result
    except HTTPException as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

