import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import Auth from '../Auth/Auth';

import {Dropdown, MenuItem, ButtonToolbar} from 'react-bootstrap';
import {FiAlignJustify} from 'react-icons/fi'

import logo from '../common/images/1_Primary_logo_on_transparent_297x64.png'


class Header extends React.Component {
    renderMenuItems = () => {
        if (!Auth.isAuthenticated()) {
            return (
                <React.Fragment>
                    <MenuItem eventKey="login" onSelect={this.props.goto}>Log In</MenuItem>
                    <MenuItem eventKey="signup" onSelect={this.props.goto}>Sign Up</MenuItem>
                </React.Fragment>
            )
        } else {
            return (
                <MenuItem eventKey="logout" onSelect={this.props.logout}>Log Out</MenuItem>
            )
        }
    };

    render() {
        return (
            <div className={'header'}>
                <ButtonToolbar>
                    <Dropdown id="dropdown-custom-1">
                        <Dropdown.Toggle noCaret>
                            <FiAlignJustify size={28}/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="super-colors">
                            <MenuItem eventKey="home" onSelect={this.props.goto}>Home</MenuItem>
                            <MenuItem divider/>
                            {this.renderMenuItems()}
                        </Dropdown.Menu>
                    </Dropdown>
                    <img className="logo" src={logo}/>
                </ButtonToolbar>
            </div>
        );
    }
}

Header.propTypes = {
    logout: PropTypes.func.isRequired,
    goto: PropTypes.func.isRequired
};


export default Header;


