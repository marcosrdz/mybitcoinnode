

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from './APIClient'
import Grid from 'react-css-grid'
const publicIP = require('public-ip')

export default class Bitcoin extends Component {

  getData() {
    publicIP.v4().then(ip => this.setState({ publicIPAddress: ip}))

    APIClient.getBlockchainInformation(response => {
      this.setState({
        headers: response.result.headers,
        blocks: response.result.blocks
      })
    })

    APIClient.getNetworkInfo(response => {
      this.setState({
        btcCoreVersion: response.result.subversion,
        connectedPeers: response.result.connections,
        relayfee: response.result.relayfee
      })
    })

    APIClient.getMempoolInfo(response => {
      this.setState({
        txmempool: response.result.size,
        minrelaytxfee: response.result.minrelaytxfee
      })
    })
  }

  constructor(props) {
    super()
    this.state = {
      pruned: false, 
      isBitcoinDaemonStatusLoading: true,
      blocks: '', 
      headers: '',
      connectedPeers: '',
      btcCoreVersion: '',
      minrelaytxfee: '',
      publicIPAddress: '',
      txmempool: ''
    }
  }

  componentDidMount() {
    this.getData()
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
            <Grid width={96} gap={16} align='center'>
              <Panel.Title>Bitcoin Daemon Status</Panel.Title>
              <Button
                bsStyle="primary"
                disabled={this.state.isBitcoinDaemonStatusLoading}
                onClick={!this.state.isBitcoinDaemonStatusLoading ? this.handleClick : null}
              >
              {this.state.isBitcoinDaemonStatusLoading ? 'Loading...' : 'Loading state'}
              </Button>
              </Grid>
            </Panel.Heading>
            <Panel.Body>
                {this.renderRowWithColumn('Bitcoin Core Version', this.state.btcCoreVersion)}
                {this.renderRowWithColumn('Node Type', this.state.pruned === false ? 'Full Node' : 'Pruned')}
                {this.renderRowWithColumn('Device At Block', this.state.blocks)}
                {this.renderRowWithColumn('Network Block', this.state.headers)}
                {this.renderRowWithColumn('Peer Connection', this.state.connectedPeers)}
                {this.renderRowWithColumn('Tx in Mempool', this.state.txmempool)}
                {this.renderRowWithColumn('Minimum Relay Fee', this.state.minrelaytxfee)}
                {this.renderRowWithColumn('Public IP Address', this.state.publicIPAddress)}
                {this.renderRowWithColumn('Device ID', 'No Data')}
                {this.renderRowWithColumn('Device Version', 'No Data')}
          </Panel.Body>        
          </Panel>
        </Grid></div></div>
    )
  }
}