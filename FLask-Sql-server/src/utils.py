def format_db_result(data):
    if not data:
        return "No results found."
    return "\n".join([str(row) for row in data])

def handle_error(e):
    return {"error": str(e)}, 500