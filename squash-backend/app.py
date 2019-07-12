import flask
from flask import Flask
from flask import request
import json
import datetime
import os
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

    form_data["timestamp"] = str(datetime.datetime.now())
    form_data["key"] = keygen

    # Filter out extra newline characters between paragraphs
    input_text_list = [x for x in form_data["input_text"].split("\n") if len(x.strip()) > 0]
    # Filter out input text with more than 4 paragraphs
    input_text_list = input_text_list[:4]
    # Finally, truncate paragraphs with more than 10000 characters
    form_data["input_text"] = "\n".join([x[:10000] for x in input_text_list])

    with open("../../squash-generation/squash/temp/queue.txt", "a") as f:
        f.write("%s\n" % keygen)

    os.mkdir("../../squash-generation/squash/temp/%s" % keygen)

    with open("../../squash-generation/squash/temp/%s/metadata.json" % keygen, "w") as f:
        f.write(json.dumps(form_data))

    response = flask.jsonify({
        "new_id": keygen
    })

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
