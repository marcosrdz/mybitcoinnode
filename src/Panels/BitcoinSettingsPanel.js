

import React, { Component } from 'react'
import { Panel, Button, ControlLabel, FormGroup, FormControl, Form, Col } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitcoinSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      bitcoinRPCUser: '',
      bitcoinRPCPassword: '',
    }
  }

  componentDidMount() {

  }

  submitPressed = (event) => {
    event.preventDefault()
    APIClient.updateConfigurationFile(this.state)
    .then(response => {
    })
    .catch(error => {
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.id] : event.target.value })
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
                <Form horizontal onSubmit={this.submitPressed}>
                  <FormGroup controlId="bitcoinRPCUser">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Username
                    </Col>
                    <Col sm={9}>
                      <FormControl type="text" placeholder="bitcoinrpc" value={this.state.webUIBitcoinRPCUser} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="bitcoinRPCPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Password
                    </Col>
                    <Col sm={9}>
                      <FormControl type="text" placeholder="bitseed" value={this.state.webUIBitcoinRPCPassword} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={3} sm={1}>
                      <Button type="submit">Save</Button>
                    </Col>
                  </FormGroup>
                </Form>
            </Panel.Body>        
            </Panel>
          </Grid>
        </div>
      </div>
    )
  }
}