def format_team_name(team_name: str) -> str:
    """Format team name to uppercase."""
    return team_name.upper()

def validate_team_name(team_name: str, valid_teams: list) -> bool:
    """Check if the provided team name is valid."""
    return team_name in valid_teams

def handle_data_loading_error(e: Exception) -> str:
    """Generate a user-friendly error message for data loading issues."""
    return f"Error loading data: {str(e)}"