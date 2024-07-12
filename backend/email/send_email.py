import smtplib
import re  
import mysql.connector
from email.mime.multipart import MIMEMultipart  
from email.mime.text import MIMEText 
from email.mime.image import MIMEImage


def sendEmail(addr):
    reg = "^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$"  
    if re.match(reg, addr):
        smtp.sendmail(my_account, to_mail, msg.as_string())
        print("정상적으로 메일이 발송되었습니다.")
    else:
        print("받으실 메일 주소를 정확히 입력하십시오.")
 
# MySQL 데이터베이스 연결 ############################
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="qlqjs120",  
    database="cartune"
)

cursor = db.cursor()

# 이메일 주소 입력받기 (가져올 데이터) ############################
to_mail = "lhs1119r@kakao.com"

# 이메일 주소로 member_id 가져오기
cursor.execute(f"SELECT member_id FROM member WHERE member_email = '{to_mail}'")
result = cursor.fetchone()

if result:
    member_id = result[0]
else:
    # 이메일이 없으면 새로 추가
    cursor.execute(f"INSERT INTO member (member_email) VALUES ('{to_mail}')")
    db.commit()
    member_id = cursor.lastrowid

# 새로운 플레이리스트 추가
playlist_created_date = '2024-07-10' # 가져올 데이터 ############################
weather_id = 1  # 가져올 데이터 ############################
cursor.execute(f"""
    INSERT INTO playlist (playlist_created_date, weather_id, member_id) 
    VALUES ('{playlist_created_date}', {weather_id}, {member_id})
    """)
db.commit()
playlist_id = cursor.lastrowid

# 플레이리스트에 노래 추가
songs = [('가수1', '노래1', playlist_id), ('가수2', '노래2', playlist_id)]  # 가져올 데이터 ############################
cursor.executemany("""
    INSERT INTO playlist_song (artist_name, playlist_song_title, playlist_id) 
    VALUES (%s, %s, %s)
    """, songs)
db.commit()

# 데이터를 가져오는 SQL 쿼리 
cursor.execute(f"""
    SELECT p.playlist_created_date, w.weather_title
    FROM playlist p
    JOIN weather w ON p.weather_id = w.weather_id
    WHERE p.playlist_id = {playlist_id}
""")
playlist = cursor.fetchone()

playlist_created_date = playlist[0]
weather_title = playlist[1]

# weather_title 변환
if weather_title == "Sunny":
    weather_description = "맑고 화창한 날"
elif weather_title == "Rainy":
     weather_description = "비가 오는 날"
elif weather_title == "Cloudy":
    weather_description = "흐린 날"
elif weather_title == "Snowy":
    weather_description = "눈이 오는 날"

cursor.execute(f"""
    SELECT artist_name, playlist_song_title 
    FROM playlist_song 
    WHERE playlist_id = {playlist_id}
""")
songs = cursor.fetchall()

# 트랙 목록 구성
tracks = "\n".join([f"{i+1}. {song[0]}" for i, song in enumerate(songs)])

# smpt 서버와 연결
gmail_smtp = "smtp.gmail.com"  
gmail_port = 465 
smtp = smtplib.SMTP_SSL(gmail_smtp, gmail_port)
 
# 이메일 보내는 계정
my_account = "lhs1119r@gmail.com"
my_password = "izwk fxnx pzsm znhf"
smtp.login(my_account, my_password)
 
# 메일 기본 정보 설정
msg = MIMEMultipart()
msg["Subject"] = f"CarTune의 특별한 플레이리스트 🎶"
msg["From"] = my_account
msg["To"] = to_mail
 
# 메일 본문 내용
content = f"""안녕하세요, \n\
{weather_description}에 어울리는 플레이리스트를 전송 드립니다.\n\n\
트랙 목록: \n\
{tracks}\n\n\
플레이리스트 생성일자: {playlist_created_date}\n\n\
주행 중에 더욱 편안한 시간을 보내시길 바랍니다.\n\
저희 CarTune은 언제나 고객님의 만족을 위해 최선을 다하겠습니다.\n\n\
감사합니다.\n\
"""
content_part = MIMEText(content, "plain")
msg.attach(content_part)
 
# 받는 메일 유효성 검사 거친 후 메일 전송
sendEmail(to_mail)
 
# smtp 서버 연결 해제
smtp.quit()

# MySQL 연결 해제
db.close()