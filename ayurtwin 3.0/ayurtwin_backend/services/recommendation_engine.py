from database.supabase_client import supabase


def generate_recommendations(predictions, user):

    recommendations = {}

    for disease, risk in predictions.items():

        if risk < 30:
            continue

        # Fetch Yoga
        yoga = supabase.table("yoga")\
            .select("*")\
            .eq("disease", disease)\
            .execute()

        # Fetch Exercise
        exercise = supabase.table("exercise")\
            .select("*")\
            .eq("disease", disease)\
            .execute()

        # Fetch Diet
        diet = supabase.table("diet")\
            .select("*")\
            .eq("disease", disease)\
            .execute()

        recommendations[disease] = {
            "risk_percentage": risk,
            "yoga": yoga.data,
            "exercise": exercise.data,
            "diet": diet.data
        }

    return recommendations