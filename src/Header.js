import React, {Component} from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap'

export default class Header extends Component {

    constructor(props) {
        super(props)
    
        this.toggle = this.toggle.bind(this)
        this.setActive = this.setActive.bind(this)
        this.state = {
          isOpen: false,
          active: 0
        }
      }
      
      toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        })
      }

      setActive(active) {
        active.preventDefault()
        console.log(active)
        this.setState({ active: active})
      }

      render() {
        return (
          <div>
            <Navbar color="light" light expand="md">
              <NavbarBrand href="/">
              <img 
                  src={require('./images/bitseed.png')} 
                  alt="Bitseed Logo"
                  style={{ width: 80, height: 30}}
              />
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav navbar className="ml-auto">
                  <NavItem>
                    <NavLink  active={this.state.active === 0} href="/bitcoin">Bitcoin</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.active === 1} disabled href="/lightning">Lightning</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.active === 2} disabled href="/electrum">Electrum</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.active === 3} disabled href="/explorer">Explorer</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.active === 4} href="/device">Device</NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Settings
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        Settings
                      </DropdownItem>
                      <DropdownItem>
                        Bitcoin Daemon
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            </Navbar>
          </div>
        )
      }
}