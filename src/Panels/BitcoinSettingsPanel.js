

import React, { Component } from 'react'
import { PageHeader, Button, ControlLabel, FormGroup, FormControl, Form, Col } from 'react-bootstrap'
import APIClient from '../APIClient'

export default class BitcoinSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      bitcoinRPCUser: '',
      bitcoinRPCPassword: '',
      bitcoinConfPath: '',
      isLoading: true
    }
  }

  componentDidMount() {
    APIClient.getBitcoinConf()
    .then(response => {
      console.log(response)
      this.setState({ 
        bitcoinRPCUser: response.rpcuser, 
        bitcoinRPCPassword: response.rpcpassword,
        bitcoinConfPath: response.bitcoinConfPath,
        isLoading: false
      })
    })
    .catch( error => {
      this.setState({ 
        isLoading: false
      })
    })
  }

  submitPressed = (event) => {
    event.preventDefault()
    this.setState({ isLoading: true }, () => {
      APIClient.updateBitcoinConfigurationFile(this.state.data)
      .then(response => {
        this.setState({ isLoading: false })
      })
      .catch(error => {
        this.setState({ isLoading: false })
      })
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.id] : event.target.value })
  }

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
          <PageHeader>Bitcoin Server Settings</PageHeader>
                <Form horizontal onSubmit={this.submitPressed}>
                <FormGroup controlId="bitcoinConfPath">
                    <Col componentClass={ControlLabel} sm={3}>
                      bitcoin.conf Path
                    </Col>
                    <Col sm={9}>
                      <FormControl disabled={this.state.isLoading} type="text" placeholder="/home/bitcoin/.bitcoin/bitcoin.conf" value={this.state.bitcoinConfPath} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="bitcoinRPCUser">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Username
                    </Col>
                    <Col sm={9}>
                      <FormControl disabled={this.state.isLoading}  type="text" placeholder="bitcoinrpc" value={this.state.bitcoinRPCUser} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="bitcoinRPCPassword">
                    <Col componentClass={ControlLabel} sm={3}>
                      RPC Password
                    </Col>
                    <Col sm={9}>
                      <FormControl disabled={this.state.isLoading}  type="text" placeholder="bitseed" value={this.state.bitcoinRPCPassword} onChange={this.handleChange} />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={3} sm={1}>
                      <Button disabled={this.state.isLoading}  type="submit">Save</Button>
                    </Col>
                  </FormGroup>
                </Form>
        </div>
      </div>
    )
  }
}