/* global chrome */
import React, {Component} from 'react';

import './Base.css';

import LoginPage from '../Login/LoginPage';
import SignUpPage from '../SignUp/SignUpPage';
import ItemCard from "../ItemCard/ItemCard";
import Header from "../Header/Header";

import Autosuggest from 'react-autosuggest';
import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import Tune from "@material-ui/icons/Tune"
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

import persistentCart from "../SaveFavorite/persistentCart"
import Favorite from "../Favorite/Favorite";
import Footer from "../Footer/Footer";
import FilterBar from "../Filter/FilterBar";

class Base extends Component {
    constructor() {
        super();
        this.loadSavedItems = this.loadSavedItems.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.getItem = this.getItem.bind(this);
        this.removeItem = this.removeItem.bind(this);

        this.logout = this.logout.bind(this);
        this.goto = this.goto.bind(this);
        this.searchTextChange = this.searchTextChange.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.renderInputComponent = this.renderInputComponent.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.searchTextSubmit = this.searchTextSubmit.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.renderContainer = this.renderContainer.bind(this);
        this.renderItems = this.renderItems.bind(this);

        this.handleFilterClick = this.handleFilterClick.bind(this);

        this.state = {
            page: "",
            searchText: "",
            suggestions: [],
            items: null,
            savedItems: {},
            showFilter: false
        }
        ;
        this.loadSavedItems();
        this.searchTextSubmit();

    }

    loadSavedItems() {
        this.setState({savedItems: persistentCart().get() || {}});
    }

    saveItem(key, item) {
        let savedItems = this.state.savedItems;
        savedItems[key] = item;
        persistentCart().persist(savedItems);
        this.setState({savedItems: savedItems});
        console.log(savedItems);
    }

    getItem(key) {
        let savedItems = this.state.savedItems;
        return savedItems ? savedItems[key] : null;
    }

    removeItem(key) {
        let savedItems = this.state.savedItems;
        delete savedItems[key];
        persistentCart().persist(savedItems);
        this.setState({savedItems: savedItems});
        console.log(savedItems);
    }

    logout() {
        this.props.auth.logout();
    }

    goto(pageName) {
        this.setState({page: pageName})
    }

    searchTextChange(event, {newValue, method}) {
        this.setState({searchText: newValue});
    };

    getSuggestions(value) {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) {
            return [];
        }
        const keywords = [
            {
                text: 'Apple'
            },
            {
                text: 'Banana'
            },
            {
                text: 'Cherry'
            },
            {
                text: 'Grapefruit'
            },
            {
                text: 'Lemon'
            },
            {
                text: 'iphone'
            },
            {
                text: 'iphone 8'
            }
        ];
        return inputLength === 0 ? [] : keywords.filter(keyword =>
            keyword.text.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    onSuggestionsFetchRequested({value}) {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };

    renderSuggestion(suggestion) {
        return (
            <div>
                {suggestion.text}
            </div>
        )
    }

    renderInputComponent(inputProps) {
        return (
            <InputBase
                startAdornment={
                    <InputAdornment position="start">
                        <IconButton>
                            <Search onClick={this.searchTextSubmit.bind(this)}/>
                        </IconButton>
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton onClick={this.handleFilterClick.bind(this)}>
                            <Tune/>
                        </IconButton>
                    </InputAdornment>
                }
                {...inputProps}
            />
        );
    }

    getSuggestionValue = suggestion => suggestion.text;

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
                return <LoginPage auth={this.props.auth}/>;
            case 'signup':
                return <SignUpPage/>;
            case 'favorite':
                return <Favorite savedItems={this.state.savedItems}
                                 saveItem={this.saveItem} removeItem={this.removeItem}/>;
            default:
                return (
                    <div id="feeds-wrapper">
                        {this.renderContainer()}
                    </div>
                )
        }
    }


    renderContainer() {
        if (this.state.items) {
            return this.renderItems();
        } else {
            return ("Loading...");
        }
    }

    handleFilterClick = () => {
        this.setState({showFilter: !this.state.showFilter});
        console.log(this.state.showFilter)
    };

    renderItems() {
        const saveItem = this.saveItem;
        const removeItem = this.removeItem;
        const getItem = this.getItem;

        let itemsList = this.state.items.map(function (item, index) {
            const isSaved = getItem(index);
            return (
                <ItemCard item={item} key={index} index={index} isSaved={isSaved}
                          saveItem={saveItem} removeItem={removeItem}/>
            );
        });

        const showFilter = this.state.showFilter;
        return (
            [
                <Collapse in={showFilter}>
                    <FilterBar/>
                </Collapse>,
                <ul className="products">
                    {itemsList}
                </ul>
            ]
        );
    }

    render() {
        const searchText = this.state.searchText;

        const inputProps = {
            value: searchText,
            onChange: this.searchTextChange.bind(this),
            placeholder: 'What are you looking for ...',
            type: "search"
        };

        return (
            <div className="base">
                <Header logout={this.logout} goto={this.goto}
                        savedNum={Object.keys(this.state.savedItems).length}/>

                <div id="search" className="search-bar">
                    {/*<input type="text" id="product_name" className="text" placeholder="Search for..."*/}
                    {/*onChange={this.searchTextChange.bind(this)}/>*/}
                    <Autosuggest
                        suggestions={this.state.suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                        renderInputComponent={this.renderInputComponent}
                    />

                </div>

                <div className="content">
                    {this.renderContent()}
                </div>

                <div className="footer">
                    <Footer goto={this.goto}/>
                </div>
            </div>

        );
    }
}

export default Base;

