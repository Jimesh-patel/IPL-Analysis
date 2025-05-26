from flask import Blueprint, jsonify
from services.data_loader import matches_df

venues_bp = Blueprint('venues', __name__)

@venues_bp.route('/venues', methods=['GET'])
def get_venues():
    """Get list of all venues"""
    if matches_df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    venues = matches_df['venue'].dropna().unique().tolist()
    return jsonify({'venues': sorted(venues)})