

import React, { Component } from 'react'
import { Panel, Button, ControlLabel, FormGroup, FormControl, Form, Col } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitseedSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      webUIBitcoinRPCHost: '',
      webUIBitcoinRPCPort: '',
      webUIBitcoinRPCUser: '',
      webUIBitcoinRPCPassword: '',
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
                  <Panel.Title>Bitseed Web UI Settings for Bitcoin</Panel.Title>
              </Panel.Heading>
              <Panel.Body>
                <Form horizontal onSubmit={this.submitPressed}>
                <FormGroup controlId="webUIBitcoinRPCHost">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Host
                    </Col>
                    <Col sm={9}>
                      <FormControl type="text" placeholder="localhost" value={this.state.webUIBitcoinRPCHost} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="webUIBitcoinRPCPort">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Port
                    </Col>
                    <Col sm={2}>
                      <FormControl type="text" placeholder="8333" value={this.state.webUIBitcoinRPCPort} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>
  
                  <FormGroup controlId="webUIBitcoinRPCUser">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Username
                    </Col>
                    <Col sm={9}>
                      <FormControl type="text" placeholder="bitcoinrpc" value={this.state.webUIBitcoinRPCUser} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="webUIBitcoinRPCPassword">
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