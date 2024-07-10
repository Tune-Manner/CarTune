import speech_recognition as sr


def listen_and_transcribe():
    # Recognizer 인스턴스 생성
    recognizer = sr.Recognizer()

    try:
        # 마이크 설정
        with sr.Microphone() as source:
            print("말씀하세요...")
            # 사용자의 말을 듣고 오디오 데이터로 저장, 최대 30초 동안 녹음
            audio = recognizer.listen(source, 5, 60)

        # Google의 음성 인식을 사용하여 한국어 인식
        text = recognizer.recognize_google(audio, language='ko-KR')
        print("당신이 말한 것: " + text)
    except sr.UnknownValueError:
        print("Google 음성 인식이 오디오를 이해하지 못했습니다.")
    except sr.RequestError as e:
        print("Google 음성 인식 서비스 요청에 실패했습니다; {0}".format(e))


# 함수 실행
listen_and_transcribe()