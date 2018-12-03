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
            console.log("remove")
        } else {
            this.setState({saved: true});
            this.props.saveItem(this.props.index, this.props.item);
            console.log(this.props.index);
        }
    }

    render() {
        return (
            <li className={'huizong'} key={this.props.index}>
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


                        <Button component="span" size="small" className="btn"
                                onClick={this.clickSavedButten}>
                            {
                                this.state.saved ? <Bookmark color="primary" fontSize="small"/> : <BookmarkBorder fontSize="small"/>
                            }
                            {
                                this.state.saved ? "saved" : "save"
                            }
                        </Button>
                        <Button component="span" size="small" color="primary" className="btn">
                            <OpenInNew fontSize="small"/>
                            visit site
                        </Button>
                    </div>

                </div>


            </li>
        )
    }
}

export default ItemCard;
