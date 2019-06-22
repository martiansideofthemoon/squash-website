import flask
from flask import Flask
from flask import request
import json
import datetime
import secrets

app = Flask(__name__)


@app.route('/get_squash', methods=['GET'])
def get_squash():
    squash_id = request.args['id']

    with open('/home/kalpesh/squash-generation/squash/final/%s.json' % squash_id, 'r') as f:
        squash_data = json.loads(f.read())

    response = flask.jsonify({
        "squash_data": squash_data
    })

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/request_squash', methods=['POST'])
def request_squash():
    form_data = json.loads(request.data.decode('utf-8'))

    keygen = secrets.token_urlsafe(12)

    response = flask.jsonify({
        "new_id": keygen
    })

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
