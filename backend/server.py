from flask import Flask, Response
import json
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'crawlers'))

from crawler import crawlByKeywords

app = Flask(__name__)


@app.route('/product/<product_name>', methods=['GET'])
def query(product_name):
    data = json.dumps(crawlByKeywords(product_name))
    resp = Response(data, status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp


@app.route('/api/v1/login', methods=['POST'])
def login(product_name):

    data = json.dumps(crawlByKeywords(product_name))
    resp = Response(data, status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp


if __name__ == "__main__":
    app.run()
