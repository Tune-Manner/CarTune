from fastapi import FastAPI, File, UploadFile
from tensorflow.python.keras.models import load_model
from keras._tf_keras.keras.preprocessing.image import smart_resize, load_img, img_to_array
# from tensorflow.python.keras.layers import VersionAwareLayers
from keras._tf_keras.keras.layers import BatchNormalization
from PIL import Image
import numpy as np
import io

app = FastAPI()

# TensorFlow 모델 로드
model = load_model("models/trainedModelE10.h5")
# model_alt = load_model("models/final_model.h5")
custom_objects = {'BatchNormalization': BatchNormalization}
# model_alt = load_model("models/final_model.h5", custom_objects=custom_objects)

# 모델 입력 형상 확인
input_shape = model.input_shape[1:]

# 전처리 함수
def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.resize((input_shape[0], input_shape[1]))  # 모델에 맞게 이미지 크기 조정
    image = np.array(image) / 255.0  # 이미지 정규화
    image = np.expand_dims(image, axis=0)  # 배치 차원 추가
    return image

# 예측 함수
def predict_image(image: np.ndarray) -> int:
    predictions = model.predict(image)
    predicted_class = np.argmax(predictions, axis=1)[0]
    return predicted_class

# def predict_image_alt(image: Image.Image) -> str:
#     image_array = smart_resize(image, (250, 250))
#     actualClasses = { 0:'Cloudy',1:'Rain',2:'Shine',3:'Sunrise' }
#     predictions = model_alt.predict(image_array)
#     classes = np.argmax(predictions)
#     return 'Predicted Class for the input image : {}'.format(actualClasses[classes])


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # 이미지 읽기 및 전처리
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))
    processed_image = preprocess_image(image)
    
    # 모델 예측
    predicted_class = predict_image(processed_image)
    # predicted_class_alt = predict_image_alt(image)
    
    # 예측 결과 반환
    return {
                "predicted_class": int(predicted_class),
                # "predicted_class_alt": predicted_class_alt
            }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
