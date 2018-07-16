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
                <LinkContainer to="/server">
                    <NavItem eventKey={1}>
                    Server
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/wallet">        
                    <NavItem eventKey={2}>
                    Wallet
                    </NavItem>
                </LinkContainer>
            </Nav>
        </Navbar>
    )
  }
}

export default Header