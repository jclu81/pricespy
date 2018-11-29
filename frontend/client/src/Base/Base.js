import React, {Component} from 'react';

import './Base.css';

import Footer from '../Footer/Footer'
import LoginPage from '../Login/LoginPage';
import Login from '../Login/Login';
import SignUpPage from '../SignUp/SignUpPage';
import ItemCard from "../ItemCard/ItemCard";

class Base extends Component {
    constructor() {
        super();
        this.state = {
            page: "",
            searchText: "",
            items: null
        };
        this.searchTextSubmit()
    }

    login() {
        this.setState({page: 'login'})
    }

    // signup() {
    //     this.setState({page: 'signup'})
    // }

    logout() {
        this.props.auth.logout();
    }

    goto(pageName) {
        this.setState({page: pageName})
    }

    searchTextChange(event) {
        this.setState({searchText: event.target.value});
    }

    searchTextSubmit() {
        const root = "https://pricespy-297.herokuapp.com/product/";
        let searchText = this.state.searchText;
        searchText = searchText || "hot";
        let url = root + searchText;

        console.log(url);
        fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
            this.setState({items: data, page: ''});
        })
    }

    renderContent() {
        switch (this.state.page) {
            case 'login':
                // return <Login></Login>
            case 'signup':
                return <SignUpPage></SignUpPage>
            case '':
                return this.renderContainer()
        }
    }

    render() {
        return (
            <div>
                <header>
                    <h2 className="logo"></h2>
                    <div id="search">
                        <input type="text" id="product_name" className="text" placeholder="Search for..."
                               onChange={this.searchTextChange.bind(this)}/>

                        <button className="search-btn" type="button" value="" hidefocus="true"
                                onClick={this.searchTextSubmit.bind(this)}/>
                    </div>
                </header>

                {this.renderContent()}

                <Footer login={this.goto.bind(this, 'login')} signup={this.goto.bind(this, 'signup')}
                        logout={this.logout.bind(this)} auth={this.props.auth}></Footer>
            </div>

        );
    }

    renderContainer() {
        if (this.state.items) {
            return (
                <div id="feeds-wrapper">
                    {this.renderItems()}
                </div>
            );
        } else {
            return (
                <div>
                    <div id='msg-app-loading'>
                        Loading...
                    </div>
                </div>
            );
        }
    }

    renderItems() {
        let itemsList = this.state.items.map(function (item) {
            return (
                <ItemCard item={item}/>
            );
        });

        return (
            <ul id="products">
                {itemsList}
            </ul>
        );
    }
}

export default Base;
