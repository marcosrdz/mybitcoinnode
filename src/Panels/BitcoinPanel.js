

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitcoinPanel extends Component {

  state = {
    panelConfiguration: {
      panelBodyPendingText: '',
      panelBodyPendingTextHidden: false,
      panelHeaderButton: {
        panelHeaderButtonButtonStyle: 'primary',
        panelHeaderButtonText: 'Loading...',
        panelHeaderButtonDisabled: true,
        panelHeaderButtonHidden: true,
        panelHeaderButtonOnPress: () => {}
      }
    },
    pruned: false, 
    isBitcoinDaemonStatusLoading: true,
    deviceID: '',
    blocks: '', 
    headers: '',
    connectedPeers: '',
    btcCoreVersion: '',
    minrelaytxfee: '',
    publicIPAddress: '',
    txmempool: ''
  }

  getNodeToShutDown() {
    this.setState(
      {
        panelConfiguration: {
          panelBodyPendingText: 'Shutting down Bitcoin Server...',
          panelBodyPendingTextHidden: false,
          panelHeaderButton: {
            panelHeaderButtonHidden: true
          }
        }
    }, () => {
        APIClient.stopDaemon().then((response) => {
          this.setState({
            panelConfiguration: {
              panelBodyPendingText: 'Bitcoin Server RPC is not reachable.',
              panelBodyPendingTextHidden: false,
              panelHeaderButton: {
                panelHeaderButtonHidden: true
              }
            }
          })
        })
      }
    )
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
          panelConfiguration : {
            panelBodyPendingText: 'Shutting down Bitcoin Server...',
            panelBodyPendingTextHidden: false,
            panelHeaderButton: {
              panelHeaderButtonHidden: true
            }
          }
        })
      } else {
        this.setState({
          panelConfiguration : {
            panelBodyPendingTextHidden: true,
            panelHeaderButton: {
              panelHeaderButtonButtonStyle: 'danger',
              panelHeaderButtonHidden: false,
              panelHeaderButtonText: 'Stop',
              panelHeaderButtonOnPress: () => { 
                if (window.confirm('Are you sure you wish to shut down your Bitcoin Server?')) this.getNodeToShutDown()             
              }
            }
          }
        }, () => this.getNetworkInformation())
      }
    }).catch((error) => {
      if (error.name === 'TypeError') {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'The provided host name is not reachable.',
            panelBodyPendingTextHidden: false,
            panelHeaderButton: {
              panelHeaderButtonHidden: true,
            }
          }
        })
      }
      else if (error.statusCode === 502) {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'Bitcoin Core RPC Server is not reachable.',
            panelBodyPendingTextHidden: false,
            panelHeaderButton: {
              panelHeaderButtonHidden: true,
            }
          }
        })
      } else {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'The provided credentials are not authorized to access this server. Please, go to settings and double check your credentials.',
            panelBodyPendingTextHidden: false,
            panelHeaderButton: {
              panelHeaderButtonHidden: true          
            }
          }
        })
      }
    })  
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
    const panelConfiguration = this.state.panelConfiguration

    if (!panelConfiguration.panelBodyPendingTextHidden) {
      return(
        <React.Fragment>
          {panelConfiguration.panelBodyPendingText}
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
    /*
    panelConfiguration: {
      panelBodyPendingText: String,
      panelBodyPendingTextHidden: Bool,
      panelHeaderButton: {
        panelHeaderButtonButtonStyle: String,
        panelHeaderButtonText: String,
        panelHeaderButtonDisabled: Boolean,
        panelHeaderButtonHidden: Boolean,
      }
    }
    */
    const panelConfiguration = this.state.panelConfiguration
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Grid>
          <Panel>
              <Panel.Heading>
              <Grid width={96} gap={240} align='center'>
                  <Panel.Title>Bitcoin Daemon Status</Panel.Title>
                  { (!panelConfiguration.panelHeaderButton.panelHeaderButtonHidden) &&
                    <Button
                      bsStyle={panelConfiguration.panelHeaderButton.panelHeaderButtonButtonStyle}
                      disabled={panelConfiguration.panelHeaderButton.panelHeaderButtonDisabled}
                      onClick={panelConfiguration.panelHeaderButton.panelHeaderButtonOnPress}
                    >
                    {panelConfiguration.panelHeaderButton.panelHeaderButtonText}
                    </Button>
                  }
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