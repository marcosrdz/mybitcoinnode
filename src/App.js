import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Server from './Server'
import Wallet from './Wallet'

class App extends Component {
  render() {
    return(
      <Router> 
        <React.Fragment>       
        <Navbar collapseOnSelect inverse>
            <Navbar.Header>
                <LinkContainer to="/">        
                    <Navbar.Brand>
                        Bitseed
                    </Navbar.Brand>
                </LinkContainer>        
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
        <Switch>
        <Route exact path='/server' component={Server} />
        <Route exact path='/wallet' component={Wallet} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }
}

export default App
