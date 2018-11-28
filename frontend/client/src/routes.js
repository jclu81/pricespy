import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';


import App from './App/App';
// import Login from './Login/Login';
import LoginPage from './Login/LoginPage';
import SignUpPage from './SignUp/SignUpPage';
import Base from './Base/Base';

import Auth from './Auth/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication();
    }
}

export const makeMainRoutes = () => {
    return (
        <Router history={history}>
            <Base auth={auth} history={history}>
                <Switch>
                    <Route exact path="/" render={(props) => <App auth={auth} {...props} />}/>
                    <Route exact path="/search/:keywords" render={(props) => <App auth={auth} {...props} />}/>
                    <Route path="/login" render={(props) => <LoginPage auth={auth} {...props} />}/>
                    <Route path="/signup" render={(props) => <SignUpPage auth={auth} {...props} />}/>
                    <Route path="/callback" render={(props) => {
                        handleAuthentication(props);
                        return <App auth={auth} {...props} />
                    }
                    }/>
                </Switch>
            </Base>
        </Router>
    );
}

