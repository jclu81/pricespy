import {Auth0Lock} from 'auth0-lock'
import {AUTH_CONFIG} from './auth0-variables';
import history from '../history';


export default class Auth {
    lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
        autoclose: true,
        auth: {
            redirectUrl: true,
            responseType: 'token id_token',
            params: {
                scope: 'openid'
            }
        }
    });

    constructor() {
        this.handleAuthentication();
        // binds functions to keep this context
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
    }

    login(username, password, callback) {
        this.lock.show();
        // this.auth0.authorize();
        // let options = {
        //     // scope: 'openid',
        //     // device: 'chrome-extension',
        //     auth: {
        //         redirectUrl: AUTH_CONFIG.callbackUrl,
        //         responseType: 'token id_token',
        //     },
        //     configurationBaseUrl: 'https://cdn.auth0.com',
        //     // allowAutocomplete: true,
        //     // allowedConnections: ['google', 'facebook', 'github'],
        //     // allowShowPassword: true,
        //     // avatar: null,
        //     // labeledSubmitButton: false,
        //     // theme: {
        //     //     logo: {logo}
        //     // }
        // };

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
        // new Auth0Chrome(AUTH_CONFIG.domain, AUTH_CONFIG.clientId)
        //     .authenticate(options)
        //     .then((authResult) => {
        //         console.log(authResult)
        //         this.auth0.parseHash((err, authResult) => {
        //             if (authResult && authResult.accessToken && authResult.idToken) {
        //                 console.log("success");
        //                 this.setSession(authResult);
        //             } else if (err) {
        //                 console.log(err);
        //             }
        //         });
        //     }).catch((err) => {
        //     console.log(err)
        //     alert(`Error: ${err.error}. Check the console for further details.`);
        // });


    }

    signup(email, password, callback) {
        let error;
        this.auth0.signup(
            {connection: AUTH_CONFIG.dbConnectionName, email, password},
            callback
        );
    }


    handleAuthentication() {
        // Add a callback for Lock's `authenticated` event
        this.lock.on('authenticated', this.setSession.bind(this));
        // Add a callback for Lock's `authorization_error` event
        this.lock.on('authorization_error', (err) => {
            console.log(err);
            alert(`Error: ${err.error}. Check the console for further details.`);
            history.replace('/home');
        });
    }


    setSession(authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            // Set the time that the access token will expire at
            let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('expires_at', expiresAt);
            // navigate to the home route
            history.replace('/home');
        }
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route
        history.replace('/home');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}
