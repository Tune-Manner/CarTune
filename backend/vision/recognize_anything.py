from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
import numpy as np
from PIL import Image
from ram.models import ram
from ram import inference_ram as inference
from ram import get_transform
import io

app = FastAPI()

class InferenceRequest(BaseModel):
    image: UploadFile

# 모델 로드 및 설정
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
image_size = 384
transform = get_transform(image_size=image_size)
model = ram(pretrained='../models/ram_swin_large_14m.pth', image_size=image_size, vit='swin_l')
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
        tags = res[0].split(" | ")

        return JSONResponse(content={"tags": tags})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
