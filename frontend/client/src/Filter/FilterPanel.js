import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './FilterPanel.css';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';


import SelectMuti from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

class FilterPanel extends Component {
    constructor(props) {
        super();
        this.state = {
            selectedSellers: null,
            selectedWords: null,
            minPrice: "",
            maxPrice: "",
        };
    }

    generateUnique = (items, tag) => {
        const set = new Set(items.map(item => item[tag]));
        return [...set];
    };

    handleSellerFilterChange = (selectedOption) => {
        this.setState({selectedSellers: selectedOption});
    };

    handleWordFilterChange = (selectedOption) => {
        this.setState({selectedWords: selectedOption});
    };

    handlePriceRangeChange = prop => event => {
        this.setState({[prop]: event.target.value});
    };

    handleFilterClear = () => {
        this.setState({selectedSellers: null, selectedWords: null, minPrice: "", maxPrice: ""});
    };
    handleFilterApply = () => {
        this.filterItems();
        this.props.closeFilterPanel();
    };
    handleFilterCancel = () => {
        this.props.closeFilterPanel();
    };

    filterItems = () => {
        let filterItems = this.props.items;


        if (this.state.selectedSellers != null) {
            let options = new Set();
            for (let name of this.state.selectedSellers) {
                options.add(name.value);

            }
            filterItems = filterItems.filter(function filter_sellers(item) {
                return options.has(item.source);
            });
        }

        if (this.state.selectedWords != null) {
            let options = new Set();
            for (let name of this.state.selectedWords) {
                options.add(name.value.toLowerCase());

            }
            filterItems = filterItems.filter(function filter_(item) {
                let words = item.title.split(' ');

                for (let word of words) {
                    if (options.has(word.toLocaleLowerCase())) {
                        return false
                    }
                }
                return true;
            })

        }

        let min = Number(this.state.minPrice);
        let max = Number(this.state.maxPrice);
        if (this.state.minPrice.length > 0 && !isNaN(min) && !isNaN(max) && min >= 0 && max > 0) {
            console.log(min);
            console.log(max);
            filterItems = filterItems.filter(function filter_sellers(item) {
                let v = Number(item.price.replace(/(\$|,|-.+)/g, '').trim());
                return v > min && v < max
            });

        }
        this.props.updateFilterItems(filterItems);
    };

    render() {
        const sourceList = this.generateUnique(this.props.items, "source");
        const options = sourceList.map((item => {
            return {value: item, label: item, key: item}
        }));

        return (
            <div>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.props.showFilter}
                    onClose={this.handleFilterClose}
                    maxWidth="sm"
                    scroll="paper"
                    fullWidth={true}
                >
                    <DialogTitle>Set Filters</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <InputLabel>Please select the sellers you want to choose from</InputLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <SelectMuti
                                    isMulti
                                    isSearchable
                                    isClearable
                                    name="sellers"
                                    value={this.state.selectedSellers}
                                    onChange={this.handleSellerFilterChange}
                                    options={options}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Please select the words to be filtered</InputLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <CreatableSelect
                                    isMulti
                                    isSearchable
                                    name="words"
                                    value={this.state.selectedWords}
                                    onChange={this.handleWordFilterChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Please select the price range</InputLabel>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth className="">
                                    <InputLabel htmlFor="min-amount">From:</InputLabel>
                                    <Input
                                        id="min-amount"
                                        onChange={this.handlePriceRangeChange('minPrice')}
                                        value={this.state.minPrice}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <FormControl fullWidth className="">
                                    <InputLabel htmlFor="max-amount">To:</InputLabel>
                                    <Input
                                        id="max-amount"
                                        value={this.state.maxPrice}
                                        onChange={this.handlePriceRangeChange('maxPrice')}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleFilterCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleFilterClear} color="primary">
                            Clean All
                        </Button>
                        <Button onClick={this.handleFilterApply} color="primary">
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


FilterPanel.propTypes = {
    items: PropTypes.array.isRequired,
    showFilter: PropTypes.bool.isRequired,
    updateFilterItems: PropTypes.func.isRequired,
    closeFilterPanel: PropTypes.func.isRequired,
};

export default FilterPanel;


