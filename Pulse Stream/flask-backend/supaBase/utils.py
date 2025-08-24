import json
from datetime import datetime

def serialize_supabase_object(obj):
    "Recursively serialize Supabase objects to JSON-serializable format"
    if obj is None:
        return None
    
    if hasattr(obj, '__dict__'):
        result = {}
        for key, value in obj.__dict__.items():
            if hasattr(value, '__dict__'):
                result[key] = serialize_supabase_object(value)
            elif isinstance(value, list):
                result[key] = [serialize_supabase_object(item) for item in value]
            elif isinstance(value, datetime):
                result[key] = value.isoformat()
            else:
                result[key] = value
        return result
    return obj