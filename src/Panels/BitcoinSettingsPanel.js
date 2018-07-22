

import React, { Component } from 'react'
import { Panel, Button, ControlLabel, FormGroup, FormControl, Form, Col } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitcoinSettingsPanel extends Component {

  getNodeToShutDown() {
    this.setState({
      isBitcoinDaemonStatusLoading: true,
      bitcoinDaemonButtonStyle: 'primary',
      bitcoinDaemonButtonText: 'Stopping...',
      bitcoinDaemonDescriptionText: 'Bitcoin Core Server is'
    }, () => {
      APIClient.stopDaemon().then((response) => {
        if (response.result === APIClient.responses) {
          this.setState({
            isBitcoinDaemonStatusLoading: false,
            bitcoinDaemonButtonStyle: 'success'
          })
        }
      })
    })
  }

  getNetworkInformation() {
    const promises = [
      APIClient.getBlockchainInformation(), 
      APIClient.getNetworkInfo(), 
      APIClient.getMempoolInfo(),
    ]
    Promise.all(promises).then((data) => {
      this.setState({
        headers: data[0].result.headers,
        blocks: data[0].result.blocks,
        btcCoreVersion: data[1].result.subversion,
        connectedPeers: data[1].result.connections,
        relayfee: data[1].result.relayfee,
        txmempool: data[2].result.size,
        minrelaytxfee: data[2].result.minrelaytxfee,
      })
    })
  }

  getNodeStatus() {
    APIClient.getBitseedDeviceData().then((serial) => {
      this.setState({ deviceID: serial })
    }).catch((error) => {
      this.setState({ deviceID: 'No data' })
    })

    APIClient.getPingResult().then((data) => {   
      if (data.error !== null && data.error.code === -28) {
        this.setState({
          isBitcoinDaemonStatusLoading: true,
          bitcoinDaemonButtonStyle: 'primary',
          bitcoinDaemonButtonText: 'Loading...'
        })
      } else {
        this.setState({
          isBitcoinDaemonStatusLoading: false,
          bitcoinDaemonButtonStyle: 'danger',
          bitcoinDaemonButtonText: 'Stop',
          bitcoinDaemonDescriptionText: undefined
        }, () => this.getNetworkInformation())
      }
    }).catch((error) => {
      if (error.name === 'TypeError') {
        this.setState({
          isBitcoinDaemonStatusLoading: false,
          bitcoinDaemonButtonStyle: 'info',
          bitcoinDaemonButtonText: 'Invalid host',
          bitcoinDaemonDescriptionText: 'The provided host name is not reachable.'
        })
      }
      else if (error.statusCode === 502) {
        this.setState({
          isBitcoinDaemonStatusLoading: false,
          bitcoinDaemonButtonStyle: 'success',
          bitcoinDaemonButtonText: 'Start',
          bitcoinDaemonDescriptionText: 'Bitcoin Core Server is not running'
        })
      } else {
        this.setState({
          isBitcoinDaemonStatusLoading: false,
          bitcoinDaemonButtonStyle: 'info',
          bitcoinDaemonButtonText: 'Invalid Credentials',
          bitcoinDaemonDescriptionText: 'The provided credentials are not authorized to access this server.'
        })
      }
    })  
  }

  constructor(props) {
    super()
    this.state = {
      pruned: false, 
      isBitcoinDaemonStatusLoading: true,
      deviceID: '',
      blocks: '', 
      headers: '',
      connectedPeers: '',
      btcCoreVersion: '',
      minrelaytxfee: '',
      publicIPAddress: '',
      txmempool: '',
      bitcoinDaemonButtonStyle: 'primary',
      bitcoinDaemonButtonText: 'Loading...',
      bitcoinDaemonDescriptionText: 'Bitcoin Core Server is'
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
   // this.interval = setInterval(() => this.getNetworkInformation(), 1000)
    this.getNodeStatus()
  }

  renderRowWithColumn(title, description = 'No Data') {
    return(
      <React.Fragment>
        <Grid width={96} gap={16}>
        <span style={{ fontWeight: 'bold', textAlign: 'left'}}>{title}</span>
        <span style={{ fontWeight: 'normal', textAlign: 'right'}}>{description}</span>
        </Grid>
        <br />
      </React.Fragment>
    )
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
                <Form horizontal>
                  <FormGroup controlId="formHorizontalEmail">
                    <Col componentClass={ControlLabel} sm={2}>
                      RPC Username
                    </Col>
                    <Col sm={10}>
                      <FormControl type="email" placeholder="bitcoinrpc" />
                    </Col>
                  </FormGroup>

                  <FormGroup controlId="formHorizontalPassword">
                    <Col componentClass={ControlLabel} sm={2}>
                    RPC Password
                    </Col>
                    <Col sm={10}>
                      <FormControl type="password" placeholder="bitseed" />
                    </Col>
                  </FormGroup>

                  <FormGroup>
                    <Col smOffset={2} sm={10}>
                      <Button type="submit">Sign in</Button>
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