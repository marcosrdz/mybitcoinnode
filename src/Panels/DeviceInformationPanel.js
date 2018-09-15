

import React, { Component } from 'react'
import { Container, Row, Col, Progress } from 'reactstrap'
import APIClient from '../APIClient'
import PanelHeader from './PanelHeader'

export default class DeviceInformationPanel extends Component {

  state = {
    panelConfiguration: {
      panelBodyPendingText: '',
      panelBodyPendingTextHidden: false,
    },
    uptime: '',
    diskSize: '',
    diskSpaceAvailable: '',
    diskSpaceUsed: '', 
    diskSpaceUsedFormatted: '',   
    ramUsed: '',
    ramFree: '',
    ramTotal: '',
    ramUsedPercentage: '',
    cpuLoad: '',
    deviceID: '',
    panelHeaderShowLoadingIndicator: false
  }

  getNodeToShutDown() {
    this.setState(
      {
        panelConfiguration: {
          panelBodyPendingText: 'Shutting down Bitcoin Server...',
          panelBodyPendingTextHidden: false
        }
    }, () => {
        APIClient.stopDaemon().then((response) => {
          this.setState({
            panelConfiguration: {
              panelBodyPendingText: 'Bitcoin Server RPC is not reachable.',
              panelBodyPendingTextHidden: false
            }
          })
        })
      }
    )
  }

  geDeviceInformation() {
    APIClient.getBitseedDeviceSerial().then((response) => {
      this.setState({ deviceID: response })
    }).catch((error) => {
      this.setState({ deviceID: 'No Data' })
    })

    APIClient.getDeviceInformation().then(response => {
      this.setState({
        uptime: response.uptime,
        diskSize: response.diskSize,
        diskSpaceAvailable: response.diskSpaceAvailable,
        diskSpaceUsed: response.diskSpaceUsed,
        diskSpaceUsedFormatted: response.diskSpaceUsedFormatted,
        ramUsed: response.ramUsed,
        ramFree: response.ramFree,
        ramTotal: response.ramTotal,
        ramUsedPercentage: response.ramUsedPercentage,
        cpuLoad: response.cpuLoad
      })
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidMount() {
   // this.interval = setInterval(() => this.getNetworkInformation(), 1000)
   this.geDeviceInformation()
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

  renderStorageRowWithColumn(storageSize = 0, storageUsed = 0, storageAvailable = 0) {
    return(
      <React.Fragment>
        <Row>
          <Col>
            <strong>Storage</strong>
          </Col>
          <Col>
          <Progress value={storageUsed}>{this.state.diskSpaceUsedFormatted} used. {storageAvailable} available. {storageSize} total.</Progress>
          </Col>
        </Row>
        <br />
      </React.Fragment>
    )
  }

  renderMemoryRowWithColumn(memoryTotal = 0, memoryUsed = 0, memoryFree = 0, memoryUsedPercentage = 0) {
    return(
      <React.Fragment>
        <Row>
          <Col>
            <strong>Memory</strong>
          </Col>
          <Col>
          <Progress value={memoryUsedPercentage}>{memoryUsed} used. {memoryFree} free. {memoryTotal} total.</Progress>
          </Col>
        </Row>
        <br />
      </React.Fragment>
    )
  }

  renderLoadingIndicatorOrData() {
    return(<React.Fragment>
        {this.renderStorageRowWithColumn(this.state.diskSize, this.state.diskSpaceUsed, this.state.diskSpaceAvailable)}
        {this.renderMemoryRowWithColumn(this.state.ramTotal, this.state.ramUsed, this.state.ramFree, this.state.ramUsedPercentage)}
        {this.renderRowWithColumn('CPU Load', this.state.cpuLoad)}
        {this.renderRowWithColumn('Uptime', this.state.uptime)}
        {this.renderRowWithColumn('Device S/N', this.state.deviceID)}
        {this.renderRowWithColumn('Device Version')}
      </React.Fragment>)
  }

  render() {
    return (
      <React.Fragment >
        <PanelHeader title="Device" subtitle="Your Node" showLoadingIndicator={this.state.panelHeaderShowLoadingIndicator} />
        <br />
        <Container>
        {this.renderLoadingIndicatorOrData()}        
        </Container>
      </React.Fragment>
    )
  }
}