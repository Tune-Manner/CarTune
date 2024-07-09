from fastapi import FastAPI, File, UploadFile
import numpy as np
from tensorflow.python.keras.models import load_model
import keras
from PIL import Image
import io

app = FastAPI()

# TensorFlow 모델 로드
model = load_model("models/trainedModelE10.h5")

# 이미지 전처리 함수
def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.resize((224, 224))  # 모델에 맞게 이미지 크기 조정
    image = np.array(image) / 255.0  # 이미지 정규화
    image = np.expand_dims(image, axis=0)  # 배치 차원 추가
    return image

# 예측 함수
def predict_image(image: np.ndarray) -> int:
    predictions = model.predict(image)
    predicted_class = np.argmax(predictions, axis=1)[0]
    return predicted_class

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # 이미지 읽기 및 전처리
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    processed_image = preprocess_image(image)
    
    # 모델 예측
    predicted_class = predict_image(processed_image)
    
    # 예측 결과 반환
    return {"predicted_class": predicted_class}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
