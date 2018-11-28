import auth0 from 'auth0-js';
import Auth0Chrome from 'auth0-chrome'
import {Auth0Lock} from 'auth0-lock'
import {AUTH_CONFIG} from './auth0-variables';
import jwt_decode from 'jwt-decode'
import history from '../history';
import logo from '../common/images/icon.png'

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: 'pricespy.auth0.com',
        clientID: 'C03OBi5IrOZgr70UZeAqFE3bwFYrmfdB',
        redirectUri: 'http://localhost:3000/callback',
        responseType: 'token id_token',
        scope: 'openid'
    });

    constructor() {
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }

    login(username, password, callback) {
        // this.auth0.authorize();
        let options = {
            // scope: 'openid',
            // device: 'chrome-extension',
            auth: {
                redirectUrl: AUTH_CONFIG.redirectUrl,
                responseType: 'token id_token',
            },
            configurationBaseUrl: 'https://cdn.auth0.com',
            // allowAutocomplete: true,
            // allowedConnections: ['google', 'facebook', 'github'],
            // allowShowPassword: true,
            // avatar: null,
            // labeledSubmitButton: false,
            // theme: {
            //     logo: {logo}
            // }
        };

        // var lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, options);
        // lock.on("authenticated", function (authResult) {
        //     // Use the token in authResult to getUserInfo() and save it to localStorage
        //     lock.getUserInfo(authResult.accessToken, function (error, profile) {
        //         if (error) {
        //             // Handle error
        //             return;
        //         }
        //
        //         document.getElementById('nick').textContent = profile.nickname;
        //
        //         localStorage.setItem('accessToken', authResult.accessToken);
        //         localStorage.setItem('profile', JSON.stringify(profile));
        //     });
        // });
        //
        // lock.show();
        new Auth0Chrome(AUTH_CONFIG.domain, AUTH_CONFIG.clientId)
            .authenticate(options)
            .then((authResult) => {
                console.log(authResult)
                this.auth0.parseHash((err, authResult) => {
                    if (authResult && authResult.accessToken && authResult.idToken) {
                        console.log("success");
                        this.setSession(authResult);
                    } else if (err) {
                        console.log(err);
                    }
                });
            }).catch((err) => {
            console.log(err)
            alert(`Error: ${err.error}. Check the console for further details.`);
        });


    }

    signup(email, password, callback) {
        let error;
        this.auth0.signup(
            {connection: AUTH_CONFIG.dbConnectionName, email, password},
            callback
        );
    }


    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                history.replace('/home');
            } else if (err) {
                history.replace('/home');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    }


    setSession(authResult) {
        // Set the time that the access token will expire at
        console.log("success");
        console.log(localStorage.authResult);
        localStorage.authResult = JSON.stringify(authResult);

        // navigate to the home route
        history.replace('/home');
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.clear();
        // navigate to the home route
        history.push('/');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        const authResult = JSON.parse(localStorage.authResult || '{}');
        const token = authResult.id_token;
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return token && (jwt_decode(token).exp > Date.now() / 1000);
    }
}
