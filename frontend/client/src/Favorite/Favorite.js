import React, {Component} from 'react';

import './Favorite.css';

import ItemCard from "../ItemCard/ItemCard";

class Favorite extends Component {
    render() {
        return this.renderContainer();
    }

    renderContainer() {
        const items = this.props.savedItems;

        if (items && items.size !== 0) {
            return (
                <div id="feeds-wrapper">
                    {this.renderItems(items)}
                </div>
            );
        } else {
            return (
                <div>
                    <div id='msg-app-loading'>
                        You don't have saved products!
                    </div>
                </div>
            );
        }
    }

    renderItems(items) {
        console.log(items)
        const saveItem = this.props.saveItem;
        const removeItem = this.props.removeItem;

        let itemsList = [];
        items.forEach(function (value, key, map) {
            itemsList.push(<ItemCard item={value} key={key} index={key} isSaved={true}
                                     saveItem={saveItem} removeItem={removeItem}/>);
        });

        return (
            <ul id="products">
                {itemsList}
            </ul>
        );
    }
}

export default Favorite;
