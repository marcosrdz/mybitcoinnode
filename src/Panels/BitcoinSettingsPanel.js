

import React, { Component } from 'react'
import { Button, FormGroup, Input, Form, Row, Col, Container, Label, FormText } from 'reactstrap'
import APIClient from '../APIClient'
import PanelHeader from './PanelHeader'
import { PulseLoader } from 'react-spinners'

export default class BitcoinSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      showLoadingIndicator: false,
      bitcoinRPCUser: '',
      bitcoinRPCPassword: '',
      bitcoinConfPath: '',
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
        showLoadingIndicator: false
      })
    })
    .catch( error => {
      this.setState({ 
        showLoadingIndicator: false
      })
    })
  }

  submitPressed = (event) => {
    event.preventDefault()
    this.setState({ showLoadingIndicator: true }, () => {
      APIClient.updateBitcoinConfigurationFile(this.state.data)
      .then(response => {
        this.setState({ showLoadingIndicator: false })
      })
      .catch(error => {
        this.setState({ showLoadingIndicator: false })
      })
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.id] : event.target.value })
  }

  renderLoadingIndicator() {
    <React.Fragment>
      <br/>
      <Row className="text-center">
        <Col>
          <PulseLoader sizeUnit={"px"} size={10} color={'#9B9B9B'} loading={true} />
        </Col>
      </Row>
      <br/>
    </React.Fragment>
  }

  renderPanelBody() {
    return(
      <React.Fragment>
        <Form disabled={this.state.showLoadingIndicator}>
            <FormText color="muted">
            View, and make changes, to the configutation file used by the Bitcoin daemon. 
            </FormText>
            <br/>
            <FormGroup>
            <Label for="bitcoinConfPath">bitcoin.conf Path</Label>
            <Input placeholder="/home/bitcoin/.bitcoin/bitcoin.conf" defaultValue={this.state.bitcoinConfPath} type="text" name="bitcoinConfPath" id="bitcoinConfPath" onChange={this.handleChange} disabled={this.state.showLoadingIndicator} />
            </FormGroup>
            <FormGroup>
            <Label for="bitcoinRPCUser">RPC Username</Label>
            <Input defaultValue={this.state.webUIBitcoinRPCUser} type="text" name="bitcoinRPCUser" id="bitcoinRPCUser" onChange={this.handleChange} disabled={this.state.showLoadingIndicator} />
            </FormGroup>
            <FormGroup>
            <Label for="bitcoinRPCPassword">RPC Password</Label>
            <Input defaultValue={this.state.webUIBitcoinRPCPassword} type="password" name="bitcoinRPCPassword" id="bitcoinRPCPassword" onChange={this.handleChange} disabled={this.state.showLoadingIndicator} />
            </FormGroup>
            <Button type="submit" onChange={this.handleChange} onClick={this.submitPressed}>Save</Button>
          </Form>
        </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <PanelHeader title="Settings" subtitle="Bitcoin Daemon"/>
        <Container>
            {this.state.showLoadingIndicator && this.renderLoadingIndicator()}
            {!this.state.showLoadingIndicator && this.renderPanelBody()}
        </Container>
      </React.Fragment>
    )
  }
}