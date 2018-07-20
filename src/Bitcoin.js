

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from './APIClient'
import Grid from 'react-css-grid'
import Addresses from './Addresses'

export default class Bitcoin extends Component {

  getNodeToShutDown() {
    this.setState({
      isBitcoinDaemonStatusLoading: true,
      bitcoinDaemonButtonStyle: 'primary',
      bitcoinDaemonButtonText: 'Stopping...'
    }, () => {
      APIClient.stopDaemon(response => {
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
    APIClient.getBlockchainInformation(response => {
      if (response.result !== undefined) {
        this.setState({
          headers: response.result.headers,
          blocks: response.result.blocks
        })
      }
    })

    APIClient.getNetworkInfo(response => {
      if (response.result !== undefined) {
        this.setState({
          btcCoreVersion: response.result.subversion,
          connectedPeers: response.result.connections,
          relayfee: response.result.relayfee
        })
      }
    })

    APIClient.getMempoolInfo(response => {
      if (response.result !== undefined) {
        this.setState({
          txmempool: response.result.size,
          minrelaytxfee: response.result.minrelaytxfee
        })
      }
    })
  }

  getNodeStatus() {
    APIClient.getPingResult().then((data) => {   
      // if (data.statusCode === 502) {
      //   this.setState({
      //     isBitcoinDaemonStatusLoading: false,
      //     bitcoinDaemonButtonStyle: 'success',
      //     bitcoinDaemonButtonText: 'Start'
      //   })
      // } else if (data.result === null) {
      if (data.error !== null && data.error.code === -28) {
        this.setState({
          isBitcoinDaemonStatusLoading: true,
          bitcoinDaemonButtonStyle: 'primary',
          bitcoinDaemonButtonText: 'Loading...'
        })
      } else {
        console.log('HERE')
        this.setState({
          isBitcoinDaemonStatusLoading: false,
          bitcoinDaemonButtonStyle: 'danger',
          bitcoinDaemonButtonText: 'Stop'
        })
        this.getNetworkInformation()
      }
    }).catch((error) => {
        this.setState({
          isBitcoinDaemonStatusLoading: false,
          bitcoinDaemonButtonStyle: 'danger',
          bitcoinDaemonButtonText: 'Invalid Credentials'
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
      txmempool: '',
      bitcoinDaemonButtonStyle: 'primary',
      bitcoinDaemonButtonText: 'Starting...'
    }
  }

  componentDidMount() {
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

  renderLoadingIndicatorOrData() {
    if (this.state.isBitcoinDaemonStatusLoading) {
      return(
        <React.Fragment>
          Bitcoin Core Server is {this.state.bitcoinDaemonButtonText.toLowerCase()}...
        </React.Fragment>
      )
    } else if (!this.state.isBitcoinDaemonStatusLoading && this.state.bitcoinDaemonButtonStyle === 'success') {
      return (
        <React.Fragment>
        Bitcoin Core Server is not running.
      </React.Fragment>
      )
    } else if (!this.state.isBitcoinDaemonStatusLoading && this.state.bitcoinDaemonButtonStyle === 'danger') {
      return (
        <React.Fragment>
        The provided credentials are not authorized to access this server.
      </React.Fragment>
      )
    } 
    else {
      return(
        <React.Fragment>
          {this.renderRowWithColumn('Bitcoin Core Version', this.state.btcCoreVersion)}
          {this.renderRowWithColumn('Node Type', this.state.pruned === false ? 'Full Node' : 'Pruned')}
          {this.renderRowWithColumn('Device At Block', this.state.blocks)}
          {this.renderRowWithColumn('Network Block', this.state.headers)}
          {this.renderRowWithColumn('Peer Connection', this.state.connectedPeers)}
          {this.renderRowWithColumn('Tx in Mempool', this.state.txmempool)}
          {this.renderRowWithColumn('Minimum Relay Fee', this.state.minrelaytxfee)}
          {this.renderRowWithColumn('Device ID', 'No Data')}
          {this.renderRowWithColumn('Device Version', 'No Data')}
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Grid>
          <Panel>
              <Panel.Heading>
              <Grid width={96} gap={240} align='center'>
                  <Panel.Title>Bitcoin Daemon Status</Panel.Title>
                    <Button
                      bsStyle={this.state.bitcoinDaemonButtonStyle}
                      disabled={this.state.isBitcoinDaemonStatusLoading}
                      onClick={!this.state.isBitcoinDaemonStatusLoading && this.state.bitcoinDaemonButtonStyle !== 'danger' ? () => {
                        if (window.confirm('Are you sure you wish to ' + this.state.bitcoinDaemonButtonText.toLowerCase() + ' the Bitcoin Server?')) this.getNodeToShutDown()             
                      } : null}
                    >
                    {this.state.bitcoinDaemonButtonText}
                    </Button>
                </Grid>
              </Panel.Heading>
              <Panel.Body>
                  {this.renderLoadingIndicatorOrData()}
            </Panel.Body>        
            </Panel>
          </Grid>
        </div>
        { !this.state.isBitcoinDaemonStatusLoading && this.state.bitcoinDaemonButtonStyle === 'success' && <Addresses /> }
      </div>
    )
  }
}