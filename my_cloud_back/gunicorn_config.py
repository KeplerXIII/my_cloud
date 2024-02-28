import os
from dotenv import load_dotenv

load_dotenv()

bind = f"{os.getenv('GUNICORN_HOST')}:{os.getenv('GUNICORN_PORT')}"