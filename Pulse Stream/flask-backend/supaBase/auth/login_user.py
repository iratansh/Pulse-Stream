from .. import supabase
from ..utils import serialize_supabase_object

def login_user(email: str, password: str) -> dict:
    try:
        response = supabase.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password
                }
            )
        user_data = serialize_supabase_object(response.user) if response.user else None
        session_data = serialize_supabase_object(response.session) if response.session else None

        return {"success": user_data, "session": session_data}
    except Exception as e:
        return {"error": str(e), "session": None}
