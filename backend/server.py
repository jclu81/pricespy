# /server.py

from functools import wraps
import json
from os import environ as env
from werkzeug.exceptions import HTTPException

from dotenv import load_dotenv, find_dotenv
from flask import Flask
from flask import jsonify
from flask import redirect
from flask import render_template
from flask import session
from flask import url_for
from authlib.flask.client import OAuth
from six.moves.urllib.parse import urlencode

app = Flask(__name__)

oauth = OAuth(app)

auth0 = oauth.register(
    'auth0',
    client_id='TIiR4To7e24ntjr1Rf9sYGBvztA3h9zM',
    client_secret='0rjk7wTQ6Vg2uh8CB0d7u7w6EDNkNE_acex0_sM8-DI0qmaHvnA0NtEC1qkCwikS',
    api_base_url='https://pricespy.auth0.com',
    access_token_url='https://pricespy.auth0.com/oauth/token',
    authorize_url='https://pricespy.auth0.com/authorize',
    client_kwargs={
        'scope': 'openid profile',
    },
)

@app.route('/')
def index():
    return '<p>Hello!</p>\n'

@app.route('/product/<product_name>', methods = ['GET'])
def query(product_name):
    data = json.dumps(crawl(product_name))
    resp = Response(data, status=200, mimetype='application/json')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'PUT,GET,POST,DELETE'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    return resp

@app.route('/callback')
def callback_handling():
    # Handles response from token endpoint
    auth0.authorize_access_token()
    resp = auth0.get('userinfo')
    userinfo = resp.json()

    # Store the user information in flask session.
    session['jwt_payload'] = userinfo
    session['profile'] = {
        'user_id': userinfo['sub'],
        'name': userinfo['name'],
        'picture': userinfo['picture']
    }
    return redirect('/dashboard')

@app.route('/login')
def login():
    return auth0.authorize_redirect(redirect_uri='YOUR_CALLBACK_URL', audience='https://pricespy.auth0.com/userinfo')

if __name__ == "__main__":
    app.run()
