from flask import Blueprint, jsonify
from services.head_to_head import HeadToHeadAnalyzer

head_to_head_bp = Blueprint('head_to_head', __name__)
analyzer = HeadToHeadAnalyzer()

@head_to_head_bp.route('/head-to-head/<team1>/<team2>', methods=['GET'])
def get_head_to_head(team1, team2):
    try:
        analysis = analyzer.get_h2h_analysis(team1.upper(), team2.upper())
        return jsonify(analysis)
    except Exception as e:
        return jsonify({'error': str(e)}), 500