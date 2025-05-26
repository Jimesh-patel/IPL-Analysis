# IPL Analysis Flask Server

## Overview
This project is a Flask-based web application that provides an API for analyzing Indian Premier League (IPL) cricket data. It allows users to retrieve information about teams, matches, venues, and perform various analyses such as team performance and head-to-head statistics.

## Project Structure
```
ipl-flask-server
├── app.py                     # Main entry point of the Flask application
├── requirements.txt           # Project dependencies
├── README.md                  # Project documentation
├── data                       # Directory containing data files
│   ├── deliveries.csv         # Deliveries data
│   └── matches.csv            # Matches data
├── config                     # Configuration settings
│   └── __init__.py           # Package initialization
├── models                     # Data models
│   ├── __init__.py           # Package initialization
│   └── team_mapping.py        # Team mapping dictionary
├── services                   # Business logic and data processing
│   ├── __init__.py           # Package initialization
│   ├── data_loader.py         # Data loading and preprocessing
│   ├── team_performance.py     # Team performance analysis functions
│   └── head_to_head.py        # Head-to-head analysis class
├── routes                     # API routes
│   ├── __init__.py           # Package initialization
│   ├── teams.py               # Team-related routes
│   ├── head_to_head.py        # Head-to-head analysis routes
│   ├── venues.py              # Venue-related routes
│   ├── seasons.py             # Season-related routes
│   └── health.py              # Health check route
└── utils                      # Utility functions
    ├── __init__.py           # Package initialization
    └── helpers.py             # Helper functions
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd ipl-flask-server
   ```

2. **Install dependencies:**
   It is recommended to use a virtual environment. You can create one using:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
   Then install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. **Data Files:**
   Ensure that the `data` directory contains the `deliveries.csv` and `matches.csv` files. These files are essential for the application to function correctly.

## Usage
To start the Flask server, run:
```
python app.py
```
The server will start on `http://0.0.0.0:5000`. You can access the API endpoints to retrieve data and perform analyses.

## API Endpoints
- **Health Check:** `GET /health` - Check if the server is running.
- **Get Teams:** `GET /teams` - Retrieve a list of all teams.
- **Team Performance:** `GET /team/<team_name>/performance` - Get performance statistics for a specific team.
- **Season Summary:** `GET /team/<team_name>/seasons` - Get detailed season-wise match summary for a team.
- **Head-to-Head Analysis:** `GET /head-to-head/<team1>/<team2>` - Get head-to-head analysis between two teams.
- **Get Venues:** `GET /venues` - Retrieve a list of all venues.
- **Get Seasons:** `GET /seasons` - Retrieve a list of all seasons.
- **Get Matches for a Season:** `GET /season/<int:season>/matches` - Get all matches for a specific season.
