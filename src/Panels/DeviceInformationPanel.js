

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

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
    deviceID: ''
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

  getNodeStatus() {
    APIClient.getPingResult().then((data) => {   
      if (data.error !== null && data.error.code === -28) {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'Shutting down Bitcoin Server...',
            panelBodyPendingTextHidden: false
          }
        })
      } else {
        this.setState({
          panelConfiguration : {
            panelBodyPendingTextHidden: true
          }
        }, () => this.geDeviceInformation())
      }
    }).catch((error) => {
      console.log(error)
      if (error.name === 'TypeError') {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'The provided host name is not reachable.',
            panelBodyPendingTextHidden: false
          }
        })
      }
      else if (error.statusCode === 502) {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'Bitcoin Core RPC Server is not reachable.',
            panelBodyPendingTextHidden: false
          }
        })
      } else {
        this.setState({
          panelConfiguration : {
            panelBodyPendingText: 'The provided credentials are not authorized to access this server. Please, go to settings and double check your credentials.',
            panelBodyPendingTextHidden: false
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
          {this.renderRowWithColumn('Disk Size', this.state.diskSize)}
          {this.renderRowWithColumn('Disk Space Used', this.state.diskSpaceUsed)}
          {this.renderRowWithColumn('Disk Space Available', this.state.diskSpaceAvailable)}
          {this.renderRowWithColumn('RAM Used', this.state.ramUsed)}
          {this.renderRowWithColumn('RAM Free', this.state.ramFree)}
          {this.renderRowWithColumn('CPU Load', this.state.cpuLoad)}
          {this.renderRowWithColumn('Uptime', this.state.uptime)}
          {this.renderRowWithColumn('Device S/N', this.state.deviceID)}
          {this.renderRowWithColumn('Device Version')}
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
                  <Panel.Title>Device Information</Panel.Title>
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