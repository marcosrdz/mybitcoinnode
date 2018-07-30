

import React, { Component } from 'react'
import { Panel, Button, ControlLabel, FormGroup, FormControl, Form, Col, DropdownButton, MenuItem } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitcoinSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
   // this.interval = setInterval(() => this.getNetworkInformation(), 1000)
  }

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Grid>
          <Panel>
              <Panel.Heading>
                  <Panel.Title>Bitcoin Server Settings</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
              {/*
                <Form horizontal>
                <FormGroup controlId="fromRPCProtocol">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Protocol
                    </Col>
                    <Col sm={9}>
                    <DropdownButton
                      key={1}
                    >
                      <MenuItem key="1">http</MenuItem>
                    </DropdownButton>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="fromRPCUser">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Username
                    </Col>
                    <Col sm={9}>
                      <FormControl type="email" placeholder="bitcoinrpc" />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="fromRPCPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                    RPC Password
                    </Col>
                    <Col sm={9}>
                      <FormControl type="password" placeholder="bitseed" />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={3} sm={8}>
                      <Button type="submit">Save</Button>
                    </Col>
                  </FormGroup>
                </Form>
                */}
                Coming Soon...
            </Panel.Body>        
            </Panel>
          </Grid>
        </div>
      </div>
    )
  }
}