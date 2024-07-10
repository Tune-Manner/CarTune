from fastapi import FastAPI
import speech_recognition as sr

app = FastAPI()

@app.post("/transcribe/")
async def transcribe_audio():
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("말씀하세요...")
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=60)

        text = recognizer.recognize_google(audio, language='ko-KR')
        return {"text": text}
    except sr.UnknownValueError:
        return {"error": "Google 음성 인식이 오디오를 이해하지 못했습니다."}
    except sr.RequestError as e:
        return {"error": f"Google 음성 인식 서비스 요청에 실패했습니다; {e}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
