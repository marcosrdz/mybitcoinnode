

import React, { Component } from 'react'
import { Button, Container, Row, Col, Progress } from 'reactstrap'
import PanelHeader from './PanelHeader'
import APIClient from '../APIClient'
import Alerts from './Alerts'
import { PulseLoader } from 'react-spinners'

export default class BitcoinPanel extends Component {

  state = {
    /* UI Data */
    pruned: undefined, 
    blocks: '0', 
    headers: undefined,
    connectedPeers: undefined,
    btcCoreVersion: undefined,
    minrelaytxfee: undefined,
    txmempool: undefined,
    /* Alerts, Indicators, Buttons visibility */
    showLoadingIndicator: true,
    showPanelButtonComponent: false,
    showNetworkConnectionErrorAlert: false,
    showLoadingBlockIndexAlert: false,
    showInitialDownloadAlert: false,
    showNodeHasBeenShutDownAlert: false,
    /* Alerts, Indicators, and Buttons UI */
    networkErrorAlertMessage: "The network connection was lost when attempting to collect the information from your node. This may be due to your node being under heavy load.",
    loadingBlockIndexAlertText: 'Loading block index...',
    panelHeaderButtonOnPress: () => { this.getNodeToShutDown() }
  }

  getNodeToShutDown() {
    this.setState({
      showLoadingIndicator: true,
    }, () => {
        APIClient.stopDaemon().then(() => {
          this.setState({
            showLoadingIndicator: false,
            showPanelButtonComponent: false,
            showNetworkConnectionErrorAlert: false,
            showInitialDownloadAlert: false,
            showLoadingBlockIndexAlert: false,
            showNodeHasBeenShutDownAlert: true
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
            showLoadingIndicator: false,         
            showNetworkConnectionErrorAlert: false,    
            showLoadingBlockIndexAlert: false,
            showPanelButtonComponent: true   
          })
      }).catch(error => {
        console.log('There was an error with 1 or more API calls.')
        console.log(error)
        this.setState({ 
          showLoadingIndicator: false, 
          showNetworkConnectionErrorAlert: true,
          showLoadingBlockIndexAlert: false,
          showPanelButtonComponent: false
        })
      })
    })
  }

  getNodeStatus() {
    this.setState({ 
      showPanelButtonComponent: false, 
      showLoadingIndicator: true,
      showLoadingBlockIndexAlert: false,
      showNodeHasBeenShutDownAlert: false,
      showInitialDownloadAlert: false
    })
    console.log('Getting node status...')
    APIClient.getPingResult().then((data) => { 
      if (data.error !== null && data.error.code === -28) {
        this.setState({
          showLoadingIndicator: true,
          showNetworkConnectionErrorAlert: false,
          showLoadingBlockIndexAlert: true,
          loadingBlockIndexAlertText: data.error.message
        })
      } else {
        this.setState({
          showNetworkConnectionErrorAlert: false,
          showLoadingBlockIndexAlert: false,
          showInitialDownloadAlert: false,
          showLoadingIndicator: true,
        }, () => this.getNetworkInformation())
      }
    }).catch((error) => {
      if (error.name === 'TypeError') {
        this.setState({
            networkErrorAlertMessage: 'The provided host name is not reachable.',
            showLoadingIndicator: false,
            showNetworkConnectionErrorAlert: true,
            showLoadingBlockIndexAlert: false,
        })
      }
      else if (error.statusCode === 502) {
        this.setState({
            networkErrorAlertMessage: 'The Bitcoin Daemon has refused your connection. Please, make sure your Bitcoin configuration file allows RPC requests that are made from your IP address.',
            showLoadingIndicator: false,
            showInitialDownloadAlert: false,
            showNetworkConnectionErrorAlert: true,
            showLoadingBlockIndexAlert: false
        })
      } else {
        this.setState({
            networkErrorAlertMessage: 'The provided credentials are not authorized to access this server. Please, go to settings and double check your credentials.',
            showPanelButtonComponent : false,
            showLoadingIndicator: false,
            showNetworkConnectionErrorAlert: true,
            showLoadingBlockIndexAlert: false      
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
      <Row>
        <Col>
          <strong>{title}</strong>
        </Col>
        <Col>
          {description}
        </Col>
      </Row>
      <br />
    </React.Fragment>
    )
  }

  renderBlockRowWithColumn(title) {
    return(
      <React.Fragment>
      <Row>
        <Col>
          <strong>{title}</strong>
        </Col>
        <Col>
        <Progress value={(this.state.blocks/this.state.headers)*100}>{this.state.blocks} of {this.state.headers} ({((this.state.blocks/this.state.headers)*100).toFixed(2)}%)</Progress>
        </Col>
      </Row>
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
    return (
      <Alerts 
        color="danger"
        title="Network Error" 
        subtitle={this.state.networkErrorAlertMessage}
        bottomComponent={
          <Button color="danger" onClick={() => 
              this.setState({ 
                showLoadingIndicator: true, 
                showNetworkConnectionErrorAlert: false,
                showLoadingBlockIndexAlert: false   
              },() => this.getNodeStatus())
            } >Retry</Button>
        } 
        />
    )
  }

  loadingBlockIndexAlert() {
    return(
      <Alerts 
        color="primary"
        subtitle={<strong>Loading block index...</strong>}
      />
      )
  }

  renderNodeHasShutDownAlert() {
    return(
      <Alerts 
      color="info"
      subtitle={<strong>Bitcoin Daemon has been shut down.</strong>}
      />
      )
  }

  initialDownloadAlert() {
    return(
      <Alerts 
      color="primary"
      subtitle={<strong>This is the initial download of all blocks. This could take a very long time, depending on your connection speed and node performance.</strong>}
      />
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

  renderPanelHeaderRightComponent() {
    return(
      <React.Fragment>
        <Button color="danger" onClick={() => { if (window.confirm('Are you sure you wish to shut down your Bitcoin Server?')) this.getNodeToShutDown()}} >
          Shut Down
        </Button>
      </React.Fragment>
    )
  }

  render() {
    return (
        <React.Fragment>
          <PanelHeader title="Bitcoin" subtitle="Daemon Status" rightComponent={this.state.showPanelButtonComponent ? this.renderPanelHeaderRightComponent() : null } />
          <Container>
            {this.state.showNodeHasBeenShutDownAlert && this.renderNodeHasShutDownAlert()}
            {this.state.showNetworkConnectionErrorAlert && this.networkConnectionErrorAlert()}
            {this.state.showLoadingBlockIndexAlert && this.loadingBlockIndexAlert()}
            {this.state.showInitialDownloadAlert && this.initialDownloadAlert()}
            {this.state.showLoadingIndicator && this.renderLoadingIndicator()}
            {!this.state.showLoadingIndicator && !this.state.showNodeHasBeenShutDownAlert && this.renderData()}
          </Container>
      </React.Fragment>
    )
  }
}