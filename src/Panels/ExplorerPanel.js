

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class ExplorerPanel extends Component {

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
   // this.getNodeStatus()
  }

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Grid>
          <Panel>
              <Panel.Heading>
              <Grid width={0} gap={0} align='center'>
                  <Panel.Title>Explorer</Panel.Title>
                </Grid>
              </Panel.Heading>
              <Panel.Body>
              Coming soon...
            </Panel.Body>        
            </Panel>
          </Grid>
        </div>
      </div>
    )
  }
}