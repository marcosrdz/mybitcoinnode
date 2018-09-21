

import React, { Component } from 'react'
import { Container, Button, Row, Col, Form, FormGroup, Label, Input, FormText } from 'reactstrap'
import APIClient from '../APIClient'
import PanelHeader from './PanelHeader'
import { PulseLoader } from 'react-spinners'

export default class GeneralSettingsPanel extends Component {

  constructor(props) {
    super()
    this.state = {
      showLoadingIndicator: false,
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
      this.setState({showLoadingIndicator: false, 
        data: {
          webUIBitcoinRPCHost: response.host,
          webUIBitcoinRPCPort: response.port,
          webUIBitcoinRPCUser: response.username,
          webUIBitcoinRPCPassword: response.password,
          webUIBitcoinRPCProtocol:  'http'
      }})

    }).catch(error => {
      this.setState({showLoadingIndicator: false})
    })
  }

  submitPressed = (event) => {
    event.preventDefault()
    this.setState({ showLoadingIndicator: true }, () => {
      APIClient.updateConfigurationFile(this.state.data)
      .then(response => {
        this.setState({ showLoadingIndicator: false })
      })
      .catch(error => {
        this.setState({ showLoadingIndicator: false })
      })
    })
  }

  handleChange = (event) => {
    let data = this.state.data
    data[event.target.id] = event.target.value
 
    this.setState({ data: data })
  }

  renderPanelBody() {
    return(
        <Form disabled={this.state.showLoadingIndicator}>
            <FormText color="muted">
            The credentials below are used to connect to your Bitcoin node's RPC service. 
            </FormText>
            <br/>
            <FormGroup>
            <Label for="webUIBitcoinRPCHost">Host</Label>
            <Input type="text" name="webUIBitcoinRPCHost" id="webUIBitcoinRPCHost" onChange={this.handleChange} disabled={this.state.showLoadingIndicator} />
            </FormGroup>
            <FormGroup>
            <Label for="webUIBitcoinRPCUser">Username</Label>
            <Input type="text" name="webUIBitcoinRPCUser" id="webUIBitcoinRPCUser" onChange={this.handleChange} disabled={this.state.showLoadingIndicator} />
            </FormGroup>
            <FormGroup>
            <Label for="webUIBitcoinRPCPassword">Password</Label>
            <Input type="password" name="webUIBitcoinRPCPassword" id="webUIBitcoinRPCPassword" onChange={this.handleChange} disabled={this.state.showLoadingIndicator} />
            </FormGroup>
            <Button type="submit" onChange={this.handleChange} onClick={this.submitPressed}>Save</Button>
        </Form>
    )
  }

    renderLoadingIndicator() {
        return(
            <React.Fragment>
            <br/>
            <Row className="text-center">
                <Col>
                <PulseLoader sizeUnit={"px"} size={10} color={'#9B9B9B'} loading={true} />
                </Col>
            </Row>
            <br/>
            </React.Fragment>
        )
  }

  render() {
    return (
        <React.Fragment>
        <PanelHeader title="Settings" subtitle="General"/>
        <Container>
          {this.renderPanelBody()}
        </Container>
      </React.Fragment>
    )
  }
}