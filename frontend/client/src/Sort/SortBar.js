import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './SortBar.css';


import Divider from "@material-ui/core/es/Divider/Divider";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

import {withStyles} from '@material-ui/core/styles';

const sortOptions = [
    // "DEFAULT",
    "PRICE: LOW TO HIGH",
    "PRICE: HIGH TO LOW",
];

const styles = {
    label: {
        lineHeight: 2.3,
        margin: "auto",
        display: "block",
        textAlign: "right",
    },
};

class SortBar extends Component {
    constructor(props) {
        super();
        this.state = {
            sortBy: "PRICE: LOW TO HIGH",
        };
    }

    handleSortByChange = (event) => {
        this.setState({sortBy: event.target.value});
        let sortedItems = this.props.items;
        switch (event.target.value) {
            case "PRICE: LOW TO HIGH":
                sortedItems.sort(function (p1, p2) {
                    let v1 = Number(p1.price.replace(/(\$|,|-.+)/g, '').trim());
                    let v2 = Number(p2.price.replace(/(\$|,|-.+)/g, '').trim());
                    if (v1 < v2)
                        return -1;
                    if (v1 > v2)
                        return 1;
                    return 0;
                });
                break;
            case "PRICE: HIGH TO LOW":
                sortedItems.sort(function (p1, p2) {
                    let v1 = Number(p1.price.replace(/(\$|,|-.+)/g, '').trim());
                    let v2 = Number(p2.price.replace(/(\$|,|-.+)/g, '').trim());
                    if (v1 < v2)
                        return 1;
                    if (v1 > v2)
                        return -1;
                    return 0;
                });
                break;
            default:

        }
        this.props.updateFilterItems(sortedItems);
    };


    render() {
        const {classes} = this.props;
        return (
            <Grid container spacing={0}>
                <Grid item xs={8}>
                    <FormControl>
                        <Select
                            value={this.state.sortBy}
                            onChange={this.handleSortByChange}
                            input={<InputBase/>}
                            displayEmpty
                            name="sortBy"
                            renderValue={value => `SORT BY ${value}`}
                        >
                            {sortOptions.map(name => (
                                <MenuItem key={name} value={name}>
                                    <ListItemText primary={name}/>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormLabel className={classes.label}>{this.props.items.length} Results</FormLabel>
                </Grid>
                <Grid item xs={12}>
                    <Divider/>
                </Grid>
            </Grid>
        )
    }
}


SortBar.propTypes = {
    items: PropTypes.array.isRequired,
    updateFilterItems: PropTypes.func.isRequired
};

export default withStyles(styles)(SortBar);


