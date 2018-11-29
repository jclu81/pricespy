import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

import {Button, Navbar} from 'react-bootstrap';


const Footer = ({
                    login,
                    signup,
                    logout,
                    auth,
                }) => (
    <div className={'footer'}>
        <Navbar fluid>
            <Navbar.Header>
                <Navbar.Brand>
                    Welcome!
                </Navbar.Brand>
                <Button
                    bsStyle="primary"
                    className="btn-margin"
                >
                    Home
                </Button>
                {
                    !auth.isAuthenticated() && (
                        <Button
                            bsStyle="primary"
                            className="btn-margin"
                            onClick={login}
                        >
                            Log In
                        </Button>

                    )
                }
                {
                    !auth.isAuthenticated() && (
                        <Button
                            bsStyle="primary"
                            className="btn-margin"
                            onClick={signup}
                        >
                            Sign Up
                        </Button>

                    )
                }
                {
                    auth.isAuthenticated() && (
                        <Button
                            bsStyle="primary"
                            className="btn-margin"
                            onClick={logout}
                        >
                            Log Out
                        </Button>
                    )
                }
            </Navbar.Header>
        </Navbar>
    </div>
);

Footer.propTypes = {
    login: PropTypes.object.isRequired,
    signup: PropTypes.object.isRequired,
    logout: PropTypes.object.isRequired,
    auth: PropTypes.func.isRequired
};


export default Footer;


