# IPL Analysis Flask API

This Flask server provides a RESTful API for IPL cricket data analysis, including teams, seasons, matches, head-to-head stats, team performance, and player performance analytics.

## Base URL

```
http://localhost:5000/
```

---

## Endpoints

### 1. Get All Teams

**GET** `/teams`

**Response:**
```json
{
  "teams": [
    "CSK",
    "MI",
    "RCB",
    "KKR",
    ...
  ]
}
```

---

### 2. Get Team Performance

**GET** `/team/<team_name>/performance`

**Path Parameters:**
- `team_name` (string): Team short code (e.g., `MI`, `RCB`, `CSK`)

**Response:**
```json
{
  "team": "MI",
  "total_matches": 210,
  "wins": 120,
  "losses": 85,
  "no_result": 5,
  "win_ratio": 57.14,
  "loss_ratio": 40.48,
  "seasons_played": [2008, 2009, ...],
  "total_seasons": 15
}
```

---

### 3. Get Head-to-Head Stats

**GET** `/head-to-head/<team1>/<team2>`

**Path Parameters:**
- `team1` (string): Team short code
- `team2` (string): Team short code

**Response:**
```json
{
  "teams": "MI vs CSK",
  "basic_stats": {
    "total_matches": 34,
    "team1_wins": 19,
    "team2_wins": 15,
    "no_results": 0,
    "team1_win_pct": 55.88,
    "team2_win_pct": 44.12,
    "head_to_head_leader": "MI"
  },
  "venue_performance": {
    "Wankhede Stadium": {
      "total_matches": 10,
      "team1_wins": 6,
      "team2_wins": 4,
      "team1_win_pct": 60.0,
      "team2_win_pct": 40.0,
      "venue_leader": "MI"
    },
    ...
  }
}
```

---

### 4. Get All Seasons

**GET** `/seasons`

**Response:**
```json
{
  "seasons": [2008, 2009, 2010, ...]
}
```

---

### 5. Get Matches for a Season

**GET** `/season/<season>/matches`

**Path Parameters:**
- `season` (string or int): Season year (e.g., `2020`)

**Response:**
```json
{
  "season": 2020,
  "total_matches": 60,
  "matches": [
    {
      "match_id": 1,
      "season": 2020,
      "team1": "MI",
      "team2": "CSK",
      "winner": "CSK",
      "venue": "Wankhede Stadium",
      "date": "2020-09-19",
      "match_type": "League",
      "toss_winner": "MI",
      "toss_decision": "bat",
      "target_runs": 162
    },
    ...
  ]
}
```

---

### 6. Get Player Performance Heatmap

**GET** `/player-performance/heatmap?top_n=<int>&sort_by=<stat>&normalize=<true|false>`

**Query Parameters:**
- `top_n` (int, optional): Number of top players to return (default: 20)
- `sort_by` (string, optional): Stat to sort by (e.g., `total_runs`, `wickets`)
- `normalize` (bool, optional): Whether to normalize values (default: true)

**Response:**
```json
{
  "players": ["Player 1", "Player 2", ...],
  "stats": ["total_runs", "wickets", ...],
  "values": [[100, 5], [90, 7], ...],              // Raw values
  "normalized_values": [[1.0, 0.5], [0.9, 0.7], ...] // Min-max normalized values
}
```

---

### 7. Get Player Performance Stats (Stat Columns)

**GET** `/player-performance/stats`

**Response:**
```json
{
  "stats": ["total_runs", "wickets", "average", ...]
}
```

---

## Error Responses

- `400 Bad Request`: Invalid input or missing parameters.
- `404 Not Found`: Resource not found.
- `500 Internal Server Error`: Data not loaded or server error.

---

## Notes

- Team names must use the short codes as per the API (e.g., `MI`, `RCB`, `CSK`).
- All endpoints return JSON.
- CORS is enabled for cross-origin requests.

---

## Example Thunder Client Collection

You can import these endpoints into Thunder Client for testing.

```
GET http://localhost:5000/teams
GET http://localhost:5000/team/MI/performance
GET http://localhost:5000/head-to-head/MI/CSK
GET http://localhost:5000/seasons
GET http://localhost:5000/season/2020/matches
GET http://localhost:5000/player-performance/heatmap
GET http://localhost:5000/player-performance/stats
```