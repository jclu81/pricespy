import React from 'react';
import PropTypes from 'prop-types';

import LoginForm from './LoginForm';

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

    processForm(event) {
        //prevent default action, in this case, the action is the submission event
        event.preventDefault();

        const email = this.state.user.email;
        const password = this.state.user.password;

        console.log("email", email);
        console.log("password", password);

        this.props.auth.login(email, password, err => {
            if (err) {
                console.log(err);
                alert(`Error: ${err.description}. Check the console for further details.`);
                this.setState({errors: err});
            } else {
                this.props.history.replace('/');
            }
        })

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

//To make react-router work
LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default LoginPage;
