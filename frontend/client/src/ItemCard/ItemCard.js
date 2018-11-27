import './ItemCard.css';
import '../App/App.css';

import React from 'react';
import {Media} from 'react-bootstrap';

class ItemCard extends React.Component {

    render() {
        return (
            <li className={'huizong'}>
                <div className="image-wrapper">
                    <a title={this.props.item.TITLE} href={this.props.item.URL} target="_blank">
                        <img src={this.props.item.IMAGE} alt={this.props.item.TITLE}/>
                    </a>
                </div>
                <div className="content-wrapper">
                    <div className="content-ctn">
                        <a title={this.props.item.TITLE} className="content-title" target="_blank">
                            {this.props.item.TITLE}
                        </a>
                        <div className="content-dollar">{this.props.item.PRICE}
                        </div>
                    </div>
                    <div className="content-from">
                        <span className="content-from-site">{this.props.item.SOURCE}</span>
                        <a title={this.props.item.TITLE} href={this.props.item.URL} className="content-buy" target="_blank">
                            Buy it
                        </a>
                    </div>
                </div>
            </li>
        )
    }
}

export default ItemCard;
