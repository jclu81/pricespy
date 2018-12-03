import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './Footer.css';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Home from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Notifications from '@material-ui/icons/Notifications';

class Footer extends Component {
    constructor() {
        super();
        this.state = {
            value: "home",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event, value) => {
        this.setState({value});
        switch (value) {
            case "home":
                this.props.goto(value);
                break;
            default:
        }
    };

    render() {
        const {value} = this.state;
        return (
            <BottomNavigation
                value={value}
                onChange={this.handleChange}
                showLabels
                className="footer-nav"
            >
                <BottomNavigationAction value="home" label="Home" icon={<Home/>}/>
                <BottomNavigationAction value="profile" label="Profile" icon={<AccountCircle/>}/>
                <BottomNavigationAction value="notifications" label="Notifications" icon={<Notifications/>}/>
            </BottomNavigation>
        )
    }
}


Footer.propTypes = {
    goto: PropTypes.func.isRequired
};

export default Footer;


