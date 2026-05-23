import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")


def send_member_email(receiver_email, name, end_date):
    try:

        subject = "Welcome to A1 Fitness Series"

        body = f"""
Hello {name},

Welcome to our Gym!

Your membership has been activated successfully.

Membership Valid Till: {end_date}

Stay consistent 💪
"""

        message = MIMEMultipart()

        message["From"] = SENDER_EMAIL
        message["To"] = receiver_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP("smtp.gmail.com", 587)

        server.starttls()

        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        server.sendmail(
            SENDER_EMAIL,
            receiver_email,
            message.as_string()
        )

        server.quit()

        print("Email Sent")

    except Exception as e:
        print("Email Error:", str(e))