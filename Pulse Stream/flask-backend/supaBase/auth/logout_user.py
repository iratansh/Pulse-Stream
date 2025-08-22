import supabase

def logout_user():
    """
    Logs out the current user by invalidating their session.
    """
    try:
        response = supabase.auth.sign_out()
        return {"success": True, "message": "Logged out successfully"}
    except Exception as e:
        return {"error": str(e)}