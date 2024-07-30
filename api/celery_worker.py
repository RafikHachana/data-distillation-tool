from app import create_app
from app.routes import celery

app = create_app()
app.app_context().push()
