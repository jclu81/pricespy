import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// import {makeMainRoutes} from './routes';
import Base from './Base/Base';
import Auth from './Auth/Auth';

const auth = new Auth();

// const routes = makeMainRoutes();
ReactDOM.render(<Base auth={auth}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
