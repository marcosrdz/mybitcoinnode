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

  state = { active: 0 }

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
                <NavLink active={this.state.active === 0} href="/bitcoin"><div onClick={() => this.setState({ active: 0 })}>Bitcoin</div></NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.active === 1} disabled href="/lightning"><div onClick={() => this.setState({ active: 1 })}>Lightning</div></NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.active === 2} disabled href="/electrum"><div onClick={() => this.setState({ active: 2})}>Electrum</div></NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.active === 3} disabled href="/explorer"><div onClick={() => this.setState({ active: 3})}>Explorer</div></NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={this.state.active === 4} href="/device"><div onClick={() => this.setState({ active: 4})}>Device</div></NavLink>
              </NavItem>
              <NavItem>
                <NavLink disabled>|</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar right>
                <DropdownToggle nav caret>
                  Settings
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem href="/generalSettings">
                    General
                  </DropdownItem>
                  <DropdownItem href="/bitcoinSettings">
                    Bitcoin Daemon
                  </DropdownItem>
                  <DropdownItem disabled>
                    Network
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