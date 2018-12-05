import './ItemCard.css';

import React from 'react';
import Button from '@material-ui/core/Button';
import Bookmark from '@material-ui/icons/Bookmark';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';
import OpenInNew from '@material-ui/icons/OpenInNew';

class ItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saved: !!this.props.isSaved
        };
        this.clickSavedButten = this.clickSavedButten.bind(this);
    }

    clickSavedButten() {
        if (this.state.saved) {
            this.setState({saved: false});
            this.props.removeItem(this.props.index);
        } else {
            this.setState({saved: true});
            this.props.saveItem(this.props.index, this.props.item);
        }
    }

    render() {
        return (
            <li className={'huizong'} key={this.props.item.product_id}>
                <div className="image-wrapper">
                    <a title={this.props.item.title} href={this.props.item.url} target="_blank">
                        <img src={this.props.item.image} alt={this.props.item.title}/>
                    </a>
                </div>
                <div className="content-wrapper">
                    <div className="content-ctn">
                        <a title={this.props.item.title} href={this.props.item.url} className="content-title"
                           target="_blank">
                            {this.props.item.title}
                        </a>
                        <div className="content-dollar">
                            {this.props.item.price}
                        </div>
                        <div className="content-shipping">
                            {this.props.item.shipping}
                        </div>
                    </div>
                    <div className="content-from">
                        <span className="content-from-site">{this.props.item.source}</span>
                        <Button component="span" size="small" className="btn"
                                onClick={this.clickSavedButten}>
                            {
                                this.state.saved ? <Bookmark color="primary" fontSize="small"/> :
                                    <BookmarkBorder fontSize="small"/>
                            }
                            {
                                this.state.saved ? "saved" : "save"
                            }
                        </Button>

                        <Button component="span" size="small" color="primary" className="btn"
                        >
                            <OpenInNew fontSize="small"/>
                            <a href={this.props.item.url}>visit site</a>
                        </Button>

                    </div>
                </div>
            </li>
        )
    }
}

export default ItemCard;
