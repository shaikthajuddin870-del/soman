import os, smtplib, ssl
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)
host = os.getenv('SMTP_HOST', '')
port = int(os.getenv('SMTP_PORT', '587'))
user = os.getenv('SMTP_USER', '')
password = os.getenv('SMTP_PASSWORD', '')

if not all([host, user, password]):
    raise SystemExit('Missing SMTP settings.')

try:
    if port == 465:
        with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=15) as server:
            server.login(user, password)
    else:
        with smtplib.SMTP(host, port, timeout=15) as server:
            server.ehlo()
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
            server.login(user, password)
    print('SMTP login successful. ✅')
except smtplib.SMTPAuthenticationError as exc:
    print(f'SMTP authentication failed ({exc.smtp_code}). Use a Google App Password, not your normal Gmail password.')
    raise SystemExit(2)
except Exception as exc:
    print(f'SMTP connection failed: {exc}')
    raise SystemExit(3)
