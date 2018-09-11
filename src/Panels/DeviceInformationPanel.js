

import React, { Component } from 'react'
import { Button } from 'reactstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'
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
    ramUsed: '',
    ramFree: '',
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
        ramUsed: response.ramUsed,
        ramFree: response.ramFree,
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
        <Grid width={96} gap={16}>
        <span style={{ fontWeight: 'bold', textAlign: 'left'}}>{title}</span>
        <span style={{ fontWeight: 'normal', textAlign: 'right'}}>{description}</span>
        </Grid>
        <br />
      </React.Fragment>
    )
  }

  renderLoadingIndicatorOrData() {
    return(<React.Fragment>
        {this.renderRowWithColumn('Disk Size', this.state.diskSize)}
        {this.renderRowWithColumn('Disk Space Used', this.state.diskSpaceUsed)}
        {this.renderRowWithColumn('Disk Space Available', this.state.diskSpaceAvailable)}
        {this.renderRowWithColumn('RAM Used', this.state.ramUsed)}
        {this.renderRowWithColumn('RAM Free', this.state.ramFree)}
        {this.renderRowWithColumn('CPU Load', this.state.cpuLoad)}
        {this.renderRowWithColumn('Uptime', this.state.uptime)}
        {this.renderRowWithColumn('Device S/N', this.state.deviceID)}
        {this.renderRowWithColumn('Device Version')}
      </React.Fragment>)
  }

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <PanelHeader title="Device" subtitle="Information" showLoadingIndicator={this.state.panelHeaderShowLoadingIndicator} />
        {this.renderLoadingIndicatorOrData()}        
        </div>
      </div>
    )
  }
}