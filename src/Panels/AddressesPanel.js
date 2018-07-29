

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class AddressesPanel extends Component {

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
        publicIPv4Address: { address: '', isReachable: false},
        publicIPv6Address: { address: '', isReachable: false},
        publicOnionAddress: { address: '', isReachable: false},
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
        <Grid gap={0} width={0}>
        <span style={{ fontWeight: 'bold', textAlign: 'left'}}>{title}</span>
        <span style={{ fontWeight: 'normal', textAlign: 'right'}}>{description.address} ({description.isReachable === false ? 'Not ' : null}Reachable)</span>
        </Grid>
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
            </React.Fragment>
        )
      } else {
          return this.state.panelConfiguration.panelBodyPendingText
      }
  }

  render() {
    const panelConfiguration = this.state.panelConfiguration

    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Grid>
          <Panel>
              <Panel.Heading>
              <Grid width={96} gap={0} align='center'>
                  <Panel.Title>Your Addresses</Panel.Title>
                  { !panelConfiguration.panelHeaderButton.panelHeaderButtonHidden &&
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
                {this.renderPanelBody()}
            </Panel.Body>        
            </Panel>
          </Grid>
        </div>
      </div>
    )
  }
}