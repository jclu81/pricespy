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
import Grid from '@material-ui/core/Grid';

import persistentCart from "../SaveFavorite/persistentCart"
import Auth from "../Auth/Auth"
import Favorite from "../Favorite/Favorite";
import Footer from "../Footer/Footer";
import SortBar from "../Sort/SortBar";
import FilterPanel from "../Filter/FilterPanel";


class Base extends Component {
    constructor() {
        super();

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
            page: "home",
            searchText: "",
            suggestions: [],
            items: null,
            filteredItems: null,
            savedItems: this.loadSavedItems(),
            showFilter: false
        }
        ;

        this.searchTextSubmit();

    }

    updateFilterItems = (data) => {
        this.setState({filteredItems: data});
    };

    loadSavedItems = () => {
        return new Map(persistentCart().get());
    };

    saveItem(key, item) {
        let savedItems = this.state.savedItems;
        savedItems.set(key, item);
        persistentCart().persist(savedItems);
        this.setState({savedItems: savedItems});
    }

    getItem(key) {
        let savedItems = this.state.savedItems;
        return savedItems ? savedItems.get(key) : null;
    }

    removeItem(key) {
        let savedItems = this.state.savedItems;
        savedItems.delete(key);
        persistentCart().persist(savedItems);
        this.setState({savedItems: savedItems});
    }

    logout() {
        Auth.deauthenticate();
    }

    goto(pageName) {
        this.setState({page: pageName})
    }

    searchTextChange = (event, {newValue, method}) => {
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
                innerRef={inputProps.ref}
                {...inputProps}
            />
        );
    }

    getSuggestionValue = suggestion => suggestion.text;

    searchTextSubmit() {
        const root = "https://pricespy-server.herokuapp.com/product/";
        let searchText = this.state.searchText;
        searchText = searchText || "new";
        let url = root + searchText;

        console.log(url);
        fetch(url)
            .then((response) => {
                return response.json();
            }).then((data) => {
            this.setState({items: data, filteredItems: data, page: 'home'});
        })
    }

    renderContent() {
        switch (this.state.page) {
            case 'login':
                return <LoginPage goto={this.goto}/>;
            case 'signup':
                return <SignUpPage goto={this.goto}/>;
            case 'favorite':
                return <Favorite savedItems={this.state.savedItems}
                                 saveItem={this.saveItem} removeItem={this.removeItem}/>;
            case 'home':
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
    };

    closeFilterPanel = () => {
        this.setState({showFilter: false});
    };


    renderItems() {
        const saveItem = this.saveItem;
        const removeItem = this.removeItem;
        const getItem = this.getItem;

        let itemsList = this.state.filteredItems.map(function (item, index) {
            const isSaved = getItem(index);
            return (
                <ItemCard item={item} key={item["product_id"]} index={index} isSaved={isSaved}
                          saveItem={saveItem} removeItem={removeItem}/>
            );
        });


        return (
            [
                <FilterPanel items={this.state.items} showFilter={this.state.showFilter}
                             updateFilterItems={this.updateFilterItems}
                             closeFilterPanel={this.closeFilterPanel}/>,
                <SortBar items={this.state.filteredItems} updateFilterItems={this.updateFilterItems}/>
                ,
                <ul className="products">
                    {itemsList}
                </ul>
            ]
        );
    }

    render() {
        const inputProps = {
            value: this.state.searchText,
            onChange: this.searchTextChange,
            placeholder: 'What are you looking for ...',
            type: "search",
            onKeyPress: (event) => {
                if (event.key === "Enter") {
                    this.searchTextSubmit();
                }
            }
        };

        return (
            <div className="base">
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Header logout={this.logout} goto={this.goto}
                                savedNum={this.state.savedItems.size}/>
                    </Grid>
                    <Grid item xs={12}>
                        <div id="search" className="search-bar">
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
                    </Grid>
                    <Grid item xs={12}>
                        <div className="content">
                            {this.renderContent()}
                        </div>
                    </Grid>
                    {/*<Grid item xs={12}>*/}
                    {/*<div className="footer">*/}
                    {/*<Footer page={this.state.page} goto={this.goto}/>*/}
                    {/*</div>*/}
                    {/*</Grid>*/}
                </Grid>
            </div>

        );
    }
}

export default Base;

