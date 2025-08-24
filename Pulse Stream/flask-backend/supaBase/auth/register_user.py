from .. import supabase
from ..utils import serialize_supabase_object


def register_user(email: str, password: str, first_name: str):
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"first_name": first_name}}
        })

        user_data = serialize_supabase_object(response.user) if response.user else None
        session_data = serialize_supabase_object(response.session) if response.session else None
        return {"success": user_data, "session": session_data}
    except Exception as e:
        return {"error": str(e), "session": None}
