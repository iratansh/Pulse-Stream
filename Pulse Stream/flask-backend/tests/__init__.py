from flask import Blueprint

tests = Blueprint("tests", __name__)

from . import e2e, integration, unit