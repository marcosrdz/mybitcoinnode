

import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import APIClient from '../APIClient'
import PanelHeader from './PanelHeader'
import Alerts from './Alerts'
import { PulseLoader } from 'react-spinners'

export default class AddressesPanel extends Component {

    state = {
      alertSubtitleText: false,
      panelHeaderShowLoadingIndicator: false,
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
        publicIPv4Address: { address: '', isReachable: false},
        publicIPv6Address: { address: '', isReachable: false},
        publicOnionAddress: { address: '', isReachable: false},
        localAddress: { address: '', isReachable: undefined},
        macAddress: { address: '', isReachable: undefined}
    }

    getNodeStatus() {    
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
                panelConfiguration: {
                    panelBodyPendingText: '',
                    panelBodyPendingTextHidden: true,
                    panelHeaderButton: {
                        panelHeaderButtonButtonStyle: 'success',
                        panelHeaderButtonText: 'Refresh',
                        panelHeaderButtonDisabled: false,
                        panelHeaderButtonHidden: false,
                        panelHeaderButtonOnPress: () => this.getNodeStatus()
                    }
                }
            }, () => this.getNetworkInformation())
          }
        }).catch((error) => {
          if (error.name === 'TypeError') {
            this.setState({
              alertSubtitleText: 'The provided host name is not reachable.',
              panelHeaderShowLoadingIndicator: false,
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
              alertSubtitleText: 'Bitcoin Core RPC Server is not reachable',
              panelHeaderShowLoadingIndicator: false,
              panelConfiguration : {
                panelBodyPendingTextHidden: false,
                panelHeaderButton: {
                  panelHeaderButtonHidden: true,
                }
              }
            })
          } else {
            this.setState({
              panelHeaderShowLoadingIndicator: false,
              alertSubtitleText: 'The provided credentials are not authorized to access this server. Please, go to settings and double check your credentials.',
              panelConfiguration : {
                panelBodyPendingTextHidden: false,
                panelHeaderButton: {
                  panelHeaderButtonHidden: true          
                }
              }
            })
          }
        })  
    }

  getNetworkInformation() {
    this.setState({
        panelConfiguration: {
            panelBodyPendingText: 'Refreshing...',
            panelBodyPendingTextHidden: false,
            panelHeaderButton: {
                panelHeaderButtonButtonStyle: 'success',
                panelHeaderButtonText: 'Refresh',
                panelHeaderButtonDisabled: true,
                panelHeaderButtonHidden: true,
            }
        }
    })

    APIClient.getDeviceInformation().then((response) => {
        console.log(response)
        this.setState({
            localAddress: { address: response.localAddress, isReachable: undefined},
            macAddress: { address: response.macAddress, isReachable: undefined}
        })
    })

    APIClient.getNetworkInfo().then((response) => {
        if (response.result !== undefined) {
            if (response.result.networks !== undefined) {        
                for (const network of response.result.networks) {
                    if (network.name === 'ipv4') {
                        let publicIPv4Address = this.state.publicIPv4Address
                        publicIPv4Address.isReachable = network.reachable
                        this.setState({ publicIPv4Address: publicIPv4Address})
                    } else if (network.name === 'ipv6') {
                        let publicIPv6Address = this.state.publicIPv6Address
                        publicIPv6Address.isReachable = network.reachable
                        this.setState({ publicIPv6Address: publicIPv6Address})
                    } else if (network.name === 'onion') {
                        let publicOnionAddress = this.state.publicOnionAddress
                        publicOnionAddress.isReachable = network.reachable
                        this.setState({ publicOnionAddress: publicOnionAddress})
                    }
                }
            }
            if (response.result.localaddresses !== undefined) {
                for (const [i, value] of response.result.localaddresses.entries()) {
                    if (i === 0) {
                        let publicIPv4Address = this.state.publicIPv4Address
                        publicIPv4Address.address = value.address + ':' + value.port
                        this.setState({ publicIPv4Address: publicIPv4Address})
                    } else if (i === 1) {
                        let publicIPv6Address = this.state.publicIPv6Address
                        publicIPv6Address.address = value.address + ':' + value.port
                        this.setState({ publicIPv6Address: publicIPv6Address})
                    } else if (i === 2) {
                        let publicOnionAddress = this.state.publicOnionAddress
                        publicOnionAddress.address = value.address + ':' + value.port
                        this.setState({ publicOnionAddress: publicOnionAddress})
                    }
                }
            }
            this.setState({ 
                panelConfiguration: {
                    panelBodyPendingText: '',
                    panelBodyPendingTextHidden: true,
                    panelHeaderButton: {
                        panelHeaderButtonButtonStyle: 'success',
                        panelHeaderButtonText: 'Refresh',
                        panelHeaderButtonDisabled: false,
                        panelHeaderButtonHidden: false,
                        panelHeaderButtonOnPress: () => this.getNodeStatus()
                    }
                }
            })
        }
    })
  }

  componentDidMount() {
    this.getNodeStatus()
  }

  renderRowWithColumn(title, description = 'No Data') {
    return(
      <React.Fragment>
        <Row>
        <Col>
        <span style={{ fontWeight: 'bold', textAlign: 'left'}}>{title}</span>
        </Col>
        <Col>
        {description.isReachable !== undefined && <span style={{ fontWeight: 'normal', textAlign: 'right'}}>{description.address} ({description.isReachable === false ? 'Not ' : null}Reachable)</span>}
        {description.isReachable === undefined && <span style={{ fontWeight: 'normal', textAlign: 'right'}}>{description.address}</span>}
        </Col>
        </Row>
        <br />
        </React.Fragment>
    )
  }

  renderPanelBody() {
      if (this.state.panelConfiguration.panelBodyPendingTextHidden) {
        return (
          <React.Fragment>
            {this.renderRowWithColumn('Public IPv4 Address:', this.state.publicIPv4Address)}
            {this.renderRowWithColumn('Public IPv6 Address:', this.state.publicIPv6Address)}
            {this.renderRowWithColumn('Public Onion Address:', this.state.publicOnionAddress)}
            {this.renderRowWithColumn('Local Address:', this.state.localAddress)}
            {this.renderRowWithColumn('MAC Address:', this.state.macAddress)}
          </React.Fragment>
        )
      } else {
          return (
            <Alerts 
            color="danger"
            title="Network Error" 
            subtitle={this.state.alertSubtitleText}
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
  }

  render() {
    return (
      <React.Fragment>
        <PanelHeader title="Addresses" subtitle="Your Network" showLoadingIndicator={this.state.panelHeaderShowLoadingIndicator} />
        <br/>
        <Container>
          {this.renderPanelBody()}
        </Container>
      </React.Fragment>
    )
  }
}