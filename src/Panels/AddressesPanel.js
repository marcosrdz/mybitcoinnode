

import React, { Component } from 'react'
import { Panel, Button } from 'react-bootstrap'
import APIClient from '../APIClient'
import Grid from 'react-css-grid'

export default class AddressesPanel extends Component {

  getNetworkInformation() {
    this.setState({ isNetworkInfoLoading: true, refreshNetworkInfoButtonStyle: 'primary'})
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
            this.setState({ isNetworkInfoLoading: false, refreshNetworkInfoButtonStyle: 'success'})
        }
    })
  }

  constructor(props) {
    super()
    this.state = {
      publicIPv4Address: { address: '', isReachable: false},
      publicIPv6Address: { address: '', isReachable: false},
      publicOnionAddress: { address: '', isReachable: false},
      isNetworkInfoLoading: true,
      refreshNetworkInfoButtonStyle: 'primary'
    }
  }

  componentDidMount() {
    this.getNetworkInformation()
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

  render() {
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Grid>
          <Panel>
              <Panel.Heading>
              <Grid width={96} gap={0} align='center'>
                  <Panel.Title>Your Addresses</Panel.Title>
                  <Button
                      bsStyle={this.state.refreshNetworkInfoButtonStyle}
                      disabled={this.state.isNetworkInfoLoading}
                      onClick={!this.state.isNetworkInfoLoading ? () => this.getNetworkInformation() : null }
                    >
                    {this.state.isNetworkInfoLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </Grid>
              </Panel.Heading>
              <Panel.Body>
                {this.renderRowWithColumn('Public IPv4 Address:', this.state.publicIPv4Address)}
                {this.renderRowWithColumn('Public IPv6 Address:', this.state.publicIPv6Address)}
                {this.renderRowWithColumn('Public Onion Address:', this.state.publicOnionAddress)}
            </Panel.Body>        
            </Panel>
          </Grid>
        </div>
      </div>
    )
  }
}