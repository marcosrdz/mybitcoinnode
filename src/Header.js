import React, { Component } from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

class Header extends Component {
  render() {
    return(
        <Navbar collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                <img 
                    src={require('./images/bitseed.png')} 
                    alt="Bitseed Logo"
                />
                </Navbar.Brand>
            <Navbar.Toggle />
            </Navbar.Header>
            <Nav>
                <LinkContainer to="/bitcoin">
                    <NavItem eventKey={1}>
                    Bitcoin
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/lightning">        
                    <NavItem eventKey={3}>
                    Lightning
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/electrum">        
                    <NavItem eventKey={2}>
                    Electrum
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/explorer">        
                    <NavItem eventKey={3}>
                    Explorer
                    </NavItem>
                </LinkContainer>
            </Nav>
            <Nav pullRight>
            <LinkContainer to="/device">
                    <NavItem eventKey={4}>
                    Device
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/settings">        
                    <NavItem eventKey={5}>
                        Settings
                    </NavItem>
                </LinkContainer>
            </Nav>
        </Navbar>
    )
  }
}

export default Header