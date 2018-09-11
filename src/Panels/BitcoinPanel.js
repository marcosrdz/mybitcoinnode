

import React, { Component } from 'react'
import { Alert, Button, Progress } from 'reactstrap'
import PanelHeader from './PanelHeader'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class BitcoinPanel extends Component {

  state = {
    panelHeaderShowLoadingIndicator: true,
    panelHeaderButtonButtonStyle: 'primary',
    panelHeaderButtonDisabled: true,
    panelHeaderButtonHidden: true,
    panelHeaderButtonOnPress: () => {},
    pruned: undefined, 
    blocks: '0', 
    headers: undefined,
    connectedPeers: undefined,
    btcCoreVersion: undefined,
    minrelaytxfee: undefined,
    txmempool: undefined,
    showNetworkConnectionErrorAlert: false,
    showLoadingBlockIndexAlert: false,
    loadingBlockIndexAlertText: 'Loading block index...',
    showInitialDownloadAlert: false,
    networkErrorAlertMessage: "The network connection was lost when attempting to collect the information from your node. This may be due to your node being under heavy load.    "
  }

  getNodeToShutDown() {
    this.setState({
      panelHeaderShowLoadingIndicator: true,
      panelHeaderButtonHidden: true
    }, () => {
        APIClient.stopDaemon().then((response) => {
          this.setState({
            panelHeaderShowLoadingIndicator: false,
            panelHeaderButtonHidden: true
          })
        })
      }
    )
  }

  getNetworkInformation() {
    this.setState({ 
      showNetworkConnectionErrorAlert: false,
      showLoadingBlockIndexAlert: false
    }, () => {
      Promise.all([
        APIClient.getNetworkInfo(), 
        APIClient.getBlockchainInformation(), 
        APIClient.getBlockCountFromBlockExplorer(), 
        APIClient.getMempoolInfo()])
        .then((values) => {
          console.log('All API Calls completed successfully.')
          console.log(values)
          this.setState({
            btcCoreVersion: values[0].result.subversion,
            connectedPeers: values[0].result.connections,
            relayfee: values[0].result.relayfee,
            blocks: values[1].result.blocks,
            pruned: values[1].result.pruned,
            showInitialDownloadAlert: values[1].result.initialblockdownload,
            headers: values[2].blockcount,
            minrelaytxfee: values[3].result.minrelaytxfee,
            txmempool: values[3].result.size,
            panelHeaderShowLoadingIndicator: false,         
            showNetworkConnectionErrorAlert: false,    
            showLoadingBlockIndexAlert: false   
          })
      }).catch(error => {
        console.log('There was an error with 1 or more API calls.')
        console.log(error)
        this.setState({ 
          panelHeaderShowLoadingIndicator: false, 
          showNetworkConnectionErrorAlert: true,
          showLoadingBlockIndexAlert: false   
        })
      })
    })
  }

  getNodeStatus() {
    APIClient.getPingResult().then((data) => { 
      if (data.error !== null && data.error.code === -28) {
        this.setState({
          panelHeaderShowLoadingIndicator: true,
          panelHeaderButtonHidden: true,
          showNetworkConnectionErrorAlert: false,
          showLoadingBlockIndexAlert: true,
          loadingBlockIndexAlertText: data.error.message
        })
      } else {
        this.setState({
          showNetworkConnectionErrorAlert: false,
          showLoadingBlockIndexAlert: false,
          panelHeaderShowLoadingIndicator: true,
          panelHeaderButtonButtonStyle: 'danger',
          panelHeaderButtonHidden: true,
          panelHeaderButtonText: 'Stop',
          panelHeaderButtonOnPress: () => { 
            if (window.confirm('Are you sure you wish to shut down your Bitcoin Server?')) this.getNodeToShutDown()             
          }
        }, () => this.getNetworkInformation())
      }
    }).catch((error) => {
      if (error.name === 'TypeError') {
        this.setState({
            panelBodyPendingText: 'The provided host name is not reachable.',
            panelBodyPendingTextHidden: false,
            panelHeaderShowLoadingIndicator: false,
            panelHeaderButtonHidden: true,
        })
      }
      else if (error.statusCode === 502) {
        this.setState({
            networkErrorAlertMessage: 'The Bitcoin Daemon seems to be unresponsive.',
            panelHeaderShowLoadingIndicator: false,
            showInitialDownloadAlert: false,
            showNetworkConnectionErrorAlert: true
        })
      } else {
        this.setState({
            panelBodyPendingText: 'The provided credentials are not authorized to access this server. Please, go to settings and double check your credentials.',
            panelBodyPendingTextHidden: false,
            panelHeaderShowLoadingIndicator: false,
            panelHeaderButtonHidden: true          
        })
      }
    })  
  }

  componentWillUnmount() {
    clearInterval(this.interval)
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

  renderBlockRowWithColumn(title, description = 'No Data') {
    return(
      <React.Fragment>
        <Grid width={20}>
        <span style={{ fontWeight: 'bold', textAlign: 'left'}}>{title}</span>
        <span style={{ textAlign: 'right'}}><Progress animated color="info" value={(this.state.blocks/this.state.headers)*100}>{((this.state.blocks/this.state.headers)*100).toFixed(2)}%</Progress>
        <span style={{ textAlign: 'right'}}>{this.state.blocks} of {this.state.headers}</span>
        </span>
        </Grid>
        <br />
      </React.Fragment>
    )
  }

  renderData() {
    console.log(this.state)
    return(
      <React.Fragment>
        {(this.state.btcCoreVersion !== undefined) && this.renderRowWithColumn('Bitcoin Core Version', this.state.btcCoreVersion)}
        {(this.state.pruned !== undefined) && this.renderRowWithColumn('Node Type', this.state.pruned === false ? 'Full Node' : 'Pruned')}
        {(this.state.blocks !== undefined && this.state.headers !== undefined) && this.renderBlockRowWithColumn('Block Status', this.state.blocks)}
        {(this.state.connectedPeers !== undefined) && this.renderRowWithColumn('Peer Connections', this.state.connectedPeers)}
        {(this.state.txmempool !== undefined) && this.renderRowWithColumn('Tx in Mempool', this.state.txmempool)}
        {(this.state.minrelaytxfee !== undefined) && this.renderRowWithColumn('Minimum Relay Fee', this.state.minrelaytxfee)}
      </React.Fragment>
    )
  }

  networkConnectionErrorAlert() {
    return(
      <React.Fragment>
        <Alert color="danger">
            <h4>Network Error</h4>
            <p>
            {this.state.networkErrorAlertMessage}
            </p>
            <p>
              <Button color="danger" onClick={() => this.getNodeStatus()}>Retry</Button>
            </p>
          </Alert>
        </React.Fragment>
    )
  }

  loadingBlockIndexAlert() {
    return(
      <React.Fragment>
        <Alert color="primary">
        <strong>Loading block index...</strong>
          </Alert>
      </React.Fragment>
    )
  }

  initialDownloadAlert() {
    return(
      <React.Fragment>
        <Alert color="primary">
        <strong>This is the initial download of all blocks. This could take a very long time, depending on your connection speed and node performance.</strong>
        </Alert>
      </React.Fragment>
    )
  }

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '60%',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <PanelHeader title="Bitcoin" subtitle="Daemon Status" showLoadingIndicator={this.state.panelHeaderShowLoadingIndicator} />
        {this.state.showNetworkConnectionErrorAlert && this.networkConnectionErrorAlert()}
        {this.state.showLoadingBlockIndexAlert && this.loadingBlockIndexAlert()}
        {this.state.showInitialDownloadAlert && this.initialDownloadAlert()}
        {this.renderData()}
        </div>
      </div>
    )
  }
}