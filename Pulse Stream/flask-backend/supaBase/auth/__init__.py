from .login_user import login_user
from .register_user import register_user
from .logout_user import logout_user
import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def init_supabase(app):
    with app.app_context():
        supabase.init_app(app)

