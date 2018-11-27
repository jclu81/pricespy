import React, {Component} from 'react';

import './App.css';
import ItemCard from "../ItemCard/ItemCard";

class App extends Component {
    constructor() {
        super();
        this.state = {
            items: null,
            pageNum: 1,
            totalPages: 1,
            loadAll: false,
        };
    }

    componentDidMount() {
        // this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
        // window.addEventListener('scroll', this.handleScroll);
        let keywords = '';
        if (this.props.match.params) {
            keywords = this.props.match.params.keywords;
            this.searchItem(keywords)
        }
    }


    render() {
        // const {isAuthenticated} = this.props.auth;
        return (
            <div>
                {this.renderContainer()}
            </div>

        );
    }

    searchItem(keywords) {
        const root = "https://pricespy-297.herokuapp.com/product/";
        let url = root + keywords;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
            this.setState({items: data});
        })
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

export default App;
