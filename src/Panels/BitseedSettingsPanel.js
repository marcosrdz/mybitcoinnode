

import React, { Component } from 'react'
import { Panel, Button, ControlLabel, FormGroup, FormControl, Form, Col, HelpBlock } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitseedSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      isLoading: true,
      data: {
        webUIBitcoinRPCProtocol:  'http',
        webUIBitcoinRPCHost: '',
        webUIBitcoinRPCPort: '',
        webUIBitcoinRPCUser: '',
        webUIBitcoinRPCPassword: ''
      }
    }
  }

  componentDidMount() {
    APIClient.fetchConfigurationFile().then((response) => {
      this.setState({isLoading: false, data: {
        webUIBitcoinRPCHost: response.host,
        webUIBitcoinRPCPort: response.port,
        webUIBitcoinRPCUser: response.username,
        webUIBitcoinRPCPassword: response.password,
        webUIBitcoinRPCProtocol:  'http'
      }})

    }).catch(error => {
      this.setState({isLoading: false})
    })
  }

  submitPressed = (event) => {
    event.preventDefault()
    this.setState({ isLoading: true }, () => {
      APIClient.updateConfigurationFile(this.state.data)
      .then(response => {
      })
      .catch(error => {
      })
    })
  }

  handleChange = (event) => {
    let data = this.state.data
    data[event.target.id] = event.target.value
 
    this.setState({ data: data })
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
                      <FormControl type="text" placeholder="localhost" value={this.state.data.webUIBitcoinRPCHost} onChange={this.handleChange} disabled={this.state.isLoading} />
                      <HelpBlock>If your Bitcoin Server is not hosted in the same machine as this web UI, you may use tools such as <a href="https://www.npmjs.com/package/corsproxy"><strong>corsproxy</strong></a></HelpBlock>
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="webUIBitcoinRPCPort">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Port
                    </Col>
                    <Col sm={2}>
                      <FormControl type="text" placeholder="8332" value={this.state.data.webUIBitcoinRPCPort} onChange={this.handleChange} disabled={this.state.isLoading} />
                    </Col>
                  </FormGroup>
  
                  <FormGroup controlId="webUIBitcoinRPCUser">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Username
                    </Col>
                    <Col sm={9}>
                      <FormControl type="text" placeholder="bitcoinrpc" value={this.state.data.webUIBitcoinRPCUser} onChange={this.handleChange} disabled={this.state.isLoading} />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="webUIBitcoinRPCPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Password
                    </Col>
                    <Col sm={9}>
                      <FormControl type="text" placeholder="bitseed" value={this.state.data.webUIBitcoinRPCPassword} onChange={this.handleChange} disabled={this.state.isLoading} />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={3} sm={1}>
                      <Button type="submit" disabled={this.state.isLoading}>Save</Button>
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