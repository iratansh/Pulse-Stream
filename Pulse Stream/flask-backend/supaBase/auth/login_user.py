from .. import supabase

def login_user(email: str, password: str) -> dict:
    try:
        user, session = supabase.auth.sign_in_with_password(email=email, password=password)
        return {"success": user, "session": session}
    except Exception as e:
        return {"error": str(e), "session": None}
