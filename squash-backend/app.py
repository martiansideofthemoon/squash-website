import flask
from flask import Flask
from flask import request
import json
import datetime

app = Flask(__name__)


@app.route('/get_squash', methods=['GET'])
def get_squash():
    squash_id = request.args['squash_id']

    with open('data/%s.json' % squash_id, 'r') as f:
        squash_data = json.loads(f.read())

    response = flask.jsonify({
        "squash_data": squash_data
    })

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
