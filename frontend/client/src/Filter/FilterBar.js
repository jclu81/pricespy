import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './FilterBar.css';

import Button from '@material-ui/core/Button';
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Divider from "@material-ui/core/es/Divider/Divider";

const options = [
    'price: up',
    'price: down',
    'featured'
];

class FilterBar extends Component {
    constructor() {
        super();
        this.state = {
            sortBy: "featured",
            source: [],
            priceRange: [],
            anchorEl: null,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {value} = this.state;
        return ([
                <Button component="span">
                    price <ArrowDownward fontSize={"small"}></ArrowDownward>
                </Button>,
                <Button component="span">
                    Featured
                </Button>,
                
                <Divider/>
            ]
        )
    }
}


FilterBar.propTypes = {};

export default FilterBar;


