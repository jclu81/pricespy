import React, {Component} from 'react';
import './Footer.css';

import { Navbar } from 'react-bootstrap';
class Footer extends Component {
    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="#home">Brand</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Navbar.Text>
                        Signed in as: <Navbar.Link href="#">Mark Otto</Navbar.Link>
                    </Navbar.Text>
                    <Navbar.Text pullRight>Have a great day!</Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Footer;
