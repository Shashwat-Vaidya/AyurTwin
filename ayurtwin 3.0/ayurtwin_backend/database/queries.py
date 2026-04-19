from database.supabase_client import supabase


def insert_sensor_data(data):
    return supabase.table("sensor_data").insert(data).execute()


def get_user(user_id):
    # Use user_id column to match the rest of the codebase
    return supabase.table("users").select("*").eq("user_id", user_id).execute()


def get_user_by_username(username: str):
    return supabase.table("users").select("*").eq("username", username).execute()


def get_user_by_email(email: str):
    return supabase.table("users").select("*").eq("email", email).execute()


def create_user(row: dict):
    resp = supabase.table("users").insert(row).execute()
    return resp


def update_user(user_id: str, fields: dict):
    return supabase.table("users").update(fields).eq("user_id", user_id).execute()


def get_training_data():
    return supabase.table("health_training_data").select("*").execute()

def get_yoga(condition_id, age):

    response = (
        supabase.table("yoga")
        .select("*")
        .eq("condition_id", condition_id)
        .lte("min_age", age)
        .gte("max_age", age)
        .execute()
    )

    return response.data


def get_exercise(condition_id, age):

    response = (
        supabase.table("exercise")
        .select("*")
        .eq("condition_id", condition_id)
        .lte("min_age", age)
        .gte("max_age", age)
        .execute()
    )

    return response.data


def get_diet(condition_id):

    response = (
        supabase.table("diet")
        .select("*")
        .eq("condition_id", condition_id)
        .execute()
    )

    return response.data


def save_predictions(user_id, pred_rows):
    """
    Save prediction results to predictions table.
    pred_rows: list of dicts with disease_id, flag, risk_score
    """
    for row in pred_rows:
        row["user_id"] = user_id
    return supabase.table("predictions").insert(pred_rows).execute()


def get_latest_sensor(user_id: str):
    return (
        supabase.table("sensor_data")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )


def get_sensor_history(user_id: str, limit: int = 50):
    return (
        supabase.table("sensor_data")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )


def get_user_predictions(user_id: str, limit: int = 10):
    return (
        supabase.table("predictions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )


def get_food_recommended(disease_id: str):
    return (
        supabase.table("diet_food")
        .select("*")
        .eq("disease_id", disease_id)
        .eq("recommended", True)
        .execute()
    )


def get_food_not_recommended(disease_id: str):
    return (
        supabase.table("diet_food")
        .select("*")
        .eq("disease_id", disease_id)
        .eq("recommended", False)
        .execute()
    )


def get_disease(disease_id: str):
    return supabase.table("diseases").select("*").eq("disease_id", disease_id).execute()


def get_all_diseases():
    return supabase.table("diseases").select("*").execute()

