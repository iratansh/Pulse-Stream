from flask import Flask
from .supaBase.auth import init_supabase 
from .app.api.v1.auth.auth import auth_bp

def create_app(config_class="config.Config"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Supabase
    init_supabase(app)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app
