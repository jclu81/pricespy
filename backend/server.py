import os
import sys
from http import HTTPStatus
from flask import Flask, Response, request
from bson import json_util
from crawler import crawl_by_keywords
import elasticsearch_client as es

sys.path.append(os.path.join(os.path.dirname(__file__), 'crawlers'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))

app = Flask(__name__)


@app.route('/product/<product_name>', methods=['GET'])
def query(product_name):
    data = json_util.dumps(crawl_by_keywords(product_name))
    resp = Response(data, status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp


@app.route('/favorite', methods=['GET'])
def list_favorite():
    user_id = request.args.get('user_id')
    data = json_util.dumps(es.get_favorite_list(user_id))
    resp = Response(data, status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp


@app.route('/favorite', methods=['POST'])
def add_favorite():
    user_id = request.args.get('user_id')
    product_id = request.args.get('product_id')
    es.add_favorite_relation(user_id, product_id)
    return ('', HTTPStatus.NO_CONTENT)


@app.route('/favorite', methods=['DELETE'])
def delete_favorite():
    user_id = request.args.get('user_id')
    product_id = request.args.get('product_id')
    es.delete_favorite_relation(user_id, product_id)
    return ('', HTTPStatus.NO_CONTENT)


@app.route('/api/v1/login', methods=['POST'])
def login(product_name):

    data = json_util.dumps(crawl_by_keywords(product_name))
    resp = Response(data, status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp


if __name__ == "__main__":
    app.run()
