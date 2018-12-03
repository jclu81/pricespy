import React, {Component} from 'react';

import './Favorite.css';

import ItemCard from "../ItemCard/ItemCard";

class Favorite extends Component {
    render() {
        return this.renderContainer();
    }

    renderContainer() {
        const items = this.props.savedItems;

        if (items && items.length !== 0) {
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
        const saveItem = this.props.saveItem;
        const removeItem = this.props.removeItem;

        let itemsList = [];
        Object.keys(items).forEach(function (key, idx) {
            console.log(key);
            console.log(items[key]);
            itemsList.push(<ItemCard item={items[key]} key={key} index={key} isSaved={true}
                                       saveItem={saveItem} removeItem={removeItem}/>);
            console.log(itemsList);
        });
        console.log(itemsList);

        return (
            <ul id="products">
                {itemsList}
            </ul>
        );
    }
}

export default Favorite;
