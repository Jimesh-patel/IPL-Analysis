from flask import Blueprint

# Initialize the routes blueprint
routes_bp = Blueprint('routes', __name__)

# Import route modules to register their routes
from .teams import *
from .head_to_head import *
from .venues import *
from .seasons import *