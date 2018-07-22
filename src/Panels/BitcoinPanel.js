

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitcoinPanel extends Component {

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

  renderLoadingIndicatorOrData() {
    if (this.state.isBitcoinDaemonStatusLoading) {
      return(
        <React.Fragment>
          {this.state.bitcoinDaemonDescriptionText} {this.state.bitcoinDaemonButtonText.toLowerCase()}...
        </React.Fragment>
      )
    } else if (this.state.bitcoinDaemonDescriptionText !== undefined) {
      return (
        <React.Fragment>
          {this.state.bitcoinDaemonDescriptionText}
        </React.Fragment>
      )
    } else {
      return(
        <React.Fragment>
          {this.renderRowWithColumn('Bitcoin Core Version', this.state.btcCoreVersion)}
          {this.renderRowWithColumn('Node Type', this.state.pruned === false ? 'Full Node' : 'Pruned')}
          {this.renderRowWithColumn('Device At Block', this.state.blocks)}
          {this.renderRowWithColumn('Network Block', this.state.headers)}
          {this.renderRowWithColumn('Peer Connection', this.state.connectedPeers)}
          {this.renderRowWithColumn('Tx in Mempool', this.state.txmempool)}
          {this.renderRowWithColumn('Minimum Relay Fee', this.state.minrelaytxfee)}
          {this.renderRowWithColumn('Device ID', this.state.deviceID)}
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
                      onClick={!this.state.isBitcoinDaemonStatusLoading && this.state.bitcoinDaemonButtonStyle !== 'info' ? () => {
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
      </div>
    )
  }
}