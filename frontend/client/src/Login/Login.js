import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonToolbar,
    Button
} from 'react-bootstrap';

class Login extends Component {

    getFormData() {
        return {
            email: ReactDOM.findDOMNode(this.refs.email).value,
            password: ReactDOM.findDOMNode(this.refs.password).value
        };
    }

    login(event) {
        event.preventDefault();
        const user = this.getFormData();
        this.props.auth.login(user.email, user.password);
    }

    signup() {
        const user = this.getFormData();
        this.props.auth.signup(user.email, user.password);
    }

    loginWithGoogle() {
        this.props.auth.loginWithGoogle();
    }

    render() {
        return (
            <div className="container">
                <Col sm={6}>
                    <form>
                        <FormGroup>
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                type="email"
                                ref="email"
                                placeholder="you@example.com"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                type="password"
                                ref="password"
                                placeholder="Enter your password"
                            />
                        </FormGroup>
                        <ButtonToolbar>
                            <Button
                                type="submit"
                                bsStyle="primary"
                                onClick={this.login.bind(this)}
                            >
                                Log In
                            </Button>
                            <Button bsStyle="primary" onClick={this.signup.bind(this)}>
                                Sign Up
                            </Button>
                        </ButtonToolbar>
                    </form>
                </Col>
                <Col sm={6}>
                    <Button bsStyle="danger" onClick={this.loginWithGoogle.bind(this)}>
                        Log In with Google
                    </Button>
                </Col>
            </div>
        );
    }
}

export default Login;
