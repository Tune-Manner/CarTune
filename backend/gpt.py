import openai
import keys

openai.api_key = keys.openai_api_key

def gptPrompt(prompt):
    try:
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
        print('\nChatGPT is now generating answer ...')
    except Exception as e:
        print("OpenAI API Error!")
        print(f"에러 내용: \n{e}")
        return
    return response.choices[0].message.content

prompt = "비오는 날에 맞는 음악 10개를 한국어로 추천해줘"
print(gptPrompt(prompt))