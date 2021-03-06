import React from 'react';
import Auth from '../Auth/Auth';
import LoginForm from './LoginForm';
import PropTypes from "prop-types";


class LoginPage extends React.Component {

    constructor(props, context) {
        super(props, context);
        //set the initial componet state
        this.state = {
            errors: {},
            user: {
                email: '',
                password: ''
            }
        };

        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    };

    loadSavedItems() {
        let user_id = Auth.getEmail();
        let request = new Request('https://pricespy-server.herokuapp.com/favorite?user_id=' + user_id, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        fetch(request)
            .then((response) => {
                return response.json();
            }).then((json) => {
            for (let data of json) {
                this.props.appendSavedItems(data)
            }
        });
    }

    processForm(event) {
        //prevent default action, in this case, the action is the submission event
        event.preventDefault();

        const email = this.state.user.email;
        const password = this.state.user.password;

        console.log("email", email);
        console.log("password", password);

        //POST LOGIN DATA
        //build a request variable
        let request = new Request('https://secure-spire-97017.herokuapp.com/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state.user.email,
                password: this.state.user.password,
            })
        });

        fetch(request)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        errors: {}
                    });
                    response.json().then(function (json) {
                        console.log(json);
                        Auth.authenticateUser(json.token, email);
                    });
                    this.loadSavedItems();
                    this.props.goto("home");
                } else {
                    console.log("Login Failed!");
                    response.json().then(function (json) {
                        const errors = json.errors ? json.errors : {};
                        errors.summary = json.message;
                        this.setState({errors});
                    }.bind(this));
                }
            });

    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;

        this.setState({
            user
        });
    }

    render() {
        return (
            <LoginForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                user={this.state.user}/>
        );
    }
}

LoginPage.propTypes = {
    goto: PropTypes.func.isRequired,
    appendSavedItems: PropTypes.func.isRequired,
};

export default LoginPage;
