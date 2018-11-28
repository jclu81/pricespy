import React, {Component} from 'react';
import {Navbar, Button} from 'react-bootstrap';

import './Base.css';


class Base extends Component {
    constructor() {
        super();
        this.state = {
            searchText: ""
        };
    }

    goTo(route) {
        this.props.history.push(`/${route}`)
    }

    login() {
        this.props.history.push('/login');
    }

    signup() {
        this.props.history.push('/signup');
    }

    logout() {
        this.props.auth.logout();
    }


    searchTextChange(event) {
        console.log(this.state);
        this.setState({searchText: event.target.value});
    }

    searchItem(event) {
        this.props.history.replace('/search/:' + this.state.searchText);
    }

    render() {
        const {isAuthenticated} = this.props.auth;

        return (
            <div>
                <header>
                    <a href="" target="_blank">
                        <h2 className="logo"></h2>
                    </a>
                    <div id="search">
                        <input type="text" id="product_name" className="text" placeholder="Search for..."
                               onChange={this.searchTextChange.bind(this)}/>

                        <button className="search-btn" type="button" value="" hidefocus="true"
                                onClick={this.searchItem.bind(this)}/>
                    </div>
                </header>


                {this.props.children}


                <div className={'footer'}>
                    <Navbar fluid>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#">Welcome!</a>
                            </Navbar.Brand>
                            <Button
                                bsStyle="primary"
                                className="btn-margin"
                                onClick={this.goTo.bind(this, 'home')}
                            >
                                Home
                            </Button>
                            {
                                !isAuthenticated() && (
                                    <Button
                                        bsStyle="primary"
                                        className="btn-margin"
                                        onClick={this.login.bind(this)}
                                    >
                                        Log In
                                    </Button>

                                )
                            }
                            {
                                !isAuthenticated() && (
                                    <Button
                                        bsStyle="primary"
                                        className="btn-margin"
                                        onClick={this.signup.bind(this)}
                                    >
                                        Sign Up
                                    </Button>

                                )
                            }
                            {
                                isAuthenticated() && (
                                    <Button
                                        bsStyle="primary"
                                        className="btn-margin"
                                        onClick={this.logout.bind(this)}
                                    >
                                        Log Out
                                    </Button>
                                )
                            }
                        </Navbar.Header>
                    </Navbar>
                </div>
            </div>

        );
    }


}

export default Base;
