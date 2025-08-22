from .. import supabase


def register_user(email: str, password: str, first_name: str):
    try:
        user, session = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"first_name": first_name}}
        })
        return {"success": user, "session": session}
    except Exception as e:
        return {"error": str(e), "session": None}
