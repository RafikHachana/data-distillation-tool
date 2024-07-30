from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flasgger import Swagger
from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    

    from routes import bp
    app.register_blueprint(bp)

    swagger_template = {
        "info": {
            "title": "Data Distillation SaaS API",
            "description": "We offer Dataset Distillation for Text and Images, as well as task tracking, history, and auto-evaluation",
            # "contact": {
            #     "email": "rafikhachana@gmail.com"
            # },
            "license": {
                "name": "MIT License",
                "url": "https://opensource.org/licenses/MIT"
            },
            "version": "1.0.0"
        },
        "host": "localhost:5000",  # The host (name or ip) serving the API
        "basePath": "/",  # The base path for the API
        "schemes": [
            "http",
            "https"
        ],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
            }
        }
    }

    swagger = Swagger(app, template=swagger_template)

    @app.route('/redoc')
    def redoc():
        return send_from_directory('static', 'redoc.html')
    return app
