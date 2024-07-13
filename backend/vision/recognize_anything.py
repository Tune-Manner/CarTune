import torch
from torchvision import transforms
from PIL import Image
import requests
from io import BytesIO

# 모델 경로 및 클래스 정의 파일 경로
model_path = 'ram_swin_large_14m.pth'
# class_file_path = 'path_to_class_file.txt' # 필요 시 클래스 정의 파일 경로

# 모델 로드
model = torch.load(model_path)
model.eval()

# 이미지 전처리
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 추론을 위한 이미지 로드
def load_image(image_path):
    if image_path.startswith('http'):
        response = requests.get(image_path)
        img = Image.open(BytesIO(response.content))
    else:
        img = Image.open(image_path)
    return img

# 추론 함수
def predict(image_path):
    img = load_image(image_path)
    img_tensor = preprocess(img).unsqueeze(0)
    
    with torch.no_grad():
        output = model(img_tensor)
    
    # 결과 해석 (여기서는 단순히 최대값의 인덱스를 사용)
    _, predicted_idx = torch.max(output, 1)
    
    # 클래스 이름 로드 (필요 시)
    # with open(class_file_path, 'r') as f:
    #     classes = [line.strip() for line in f.readlines()]
    # predicted_class = classes[predicted_idx.item()]
    
    return predicted_idx.item() # or predicted_class if classes are loaded

# 테스트
image_path = 'path_to_your_image.jpg' # 또는 URL
result = predict(image_path)
print(f'Predicted class: {result}')
