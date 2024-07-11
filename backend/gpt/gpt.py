import openai
import sys
import os
from cryptography.fernet import Fernet
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from credentials.credentials import Encrypted_text2
import json

with open("../credentials/encryption_key2.key", "rb") as key_file:
    key = key_file.read()

cipher_suite = Fernet(key)

openai.api_key = cipher_suite.decrypt(Encrypted_text2).decode()

def gptPrompt(weather):
    try:
        prompt = "{} 날씨에 맞는 음악 10개를 추천해줘. 반드시 영어로 아래 양식에 맞게 작성해줘.\n\
        {{\
        \t\"songs\": [\
        \t\t{{ \"title\": \"Spring Day\", \"artist\": \"BTS\" }},\
        \t\t{{ \"title\": \"Any Song\", \"artist\": \"Zico\" }},\
        \t\t{{ \"title\": \"DDU-DU DDU-DU\", \"artist\": \"BLACKPINK\" }},\
        \t\t{{ \"title\": \"Blueming\", \"artist\": \"IU\" }},\
        \t\t{{ \"title\": \"Cheer Up\", \"artist\": \"TWICE\" }},\
        \t\t{{ \"title\": \"LILAC\", \"artist\": \"IU\" }}\
        \t],\
        \t\"playlist_name\": \"{} day playlist\"\
        }}".format(weather, weather)

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
        # print('\nChatGPT is now generating answer ...')

    except Exception as e:
        print("OpenAI API Error!")
        print(f"에러 내용: \n{e}")
        return
    return json.loads(response.choices[0].message.content)

weather = "sunny"
result = gptPrompt(weather)
print(result)
print(f"type of result is: {result}")