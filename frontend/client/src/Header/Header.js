import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import Auth from '../Auth/Auth';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Bookmarks from '@material-ui/icons/Bookmarks';


import logo from '../common/images/1_Primary_logo_on_transparent_297x64.png'

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            anchorEl: null
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleMenuClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleFavoriteClick = () => {
        this.props.goto("favorite");
    };

    handleClose = (event, key) => {
        console.log(key);
        this.setState({anchorEl: null});
        switch (key) {
            case "home":
            // this.props.goto("home");
            case "login":
            // this.props.goto("login");
            case "signup":
                // this.props.goto("signup");
                this.props.goto(key);
                break;
            case "logout":
                this.props.logout();
                break;
            default:
        }
    };

    renderMenuItems = () => {
        let menuItems = [];
        menuItems.push(
            <MenuItem key="home" onClick={event => this.handleClose(event, "home")}>Home</MenuItem>
        );
        menuItems.push(<Divider key="divider"/>);
        if (!Auth.isAuthenticated()) {
            menuItems.push([
                <MenuItem key="login" onClick={event => this.handleClose(event, "login")}>Log In</MenuItem>,
                <MenuItem key="signup" onClick={event => this.handleClose(event, "signup")}>Sign Up</MenuItem>
            ]);
        } else {
            menuItems.push(
                <MenuItem key="logout" onClick={event => this.handleClose(event, "logout")}>Log Out</MenuItem>
            );
        }
        return menuItems;
    };

    render() {
        const {anchorEl} = this.state;
        const open = Boolean(anchorEl);

        const renderShoppingCart = () => {

            if (this.props.savedNum && this.props.savedNum !== 0) {
                return (
                    <IconButton className="favorite" onClick={this.handleFavoriteClick}>
                        <Badge badgeContent={this.props.savedNum}>
                            <Bookmarks color="primary"/>
                        </Badge>
                    </IconButton>
                )
            } else {
                return (
                    <IconButton disabled className="favorite">
                        <Bookmarks/>
                    </IconButton>
                )
            }

        };

        return (
            <div className="header">
                <IconButton
                    aria-label="More"
                    aria-owns={open ? 'long-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenuClick}
                >
                    <MenuIcon/>
                </IconButton>
                <Menu id="long-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={this.handleClose}
                      PaperProps={{
                          style: {
                              maxHeight: 48 * 4.5,
                              width: 150,
                          },
                      }}>
                    {this.renderMenuItems()}
                </Menu>
                <img className="logo" src={logo} alt="PriceSpy"/>
                {renderShoppingCart()}
            </div>
        );
    }
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    goto: PropTypes.func.isRequired
};


export default Header;


