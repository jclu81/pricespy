from authlib.flask.client import OAuth

oauth = OAuth(app)

auth0 = oauth.register(
    'auth0',
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    api_base_url='https://YOUR_AUTH0_DOMAIN',
    access_token_url='https://YOUR_AUTH0_DOMAIN/oauth/token',
    authorize_url='https://YOUR_AUTH0_DOMAIN/authorize',
    client_kwargs={
        'scope': 'openid profile',
    },
)