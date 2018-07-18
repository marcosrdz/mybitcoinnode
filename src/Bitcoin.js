

import React, { Component } from 'react'
import { Grid, Row, Col, Panel } from 'react-bootstrap'
import APIClient from './APIClient'

export default class Bitcoin extends Component {

  getBlockchainInformation() {
    APIClient.getBlockchainInformation(response => {
      console.log(response.result)
      this.setState({bitcoinBlockchainInformation: response.result})
    })
  }

  constructor(props) {
    super()
    this.state = {
      bitcoinBlockchainInformation: { 
        blocks: '', 
        pruned: false, 
        headers: ''
      }
    }
    this.getBlockchainInformation()
  }

  renderRowWithColumn(title, description = 'No Data') {
    return(
      <Row className="show-grid">
        <Col xs={6} md={4}>
        <span style={{ fontWeight: 'bold'}}>{title}</span>
        </Col>
        <Col xs={6} md={4}>
        {description}
        </Col>
      </Row>
    )
  }

  render() {
    return (
         <Panel>
            <Panel.Heading>Bitcoin Daemon Status</Panel.Heading>
            <Panel.Body>
            <Grid container-fluid>
              {this.renderRowWithColumn('Bitcoin Core Version','No Data')}
              {this.renderRowWithColumn('Node Type', this.state.bitcoinBlockchainInformation.pruned === false ? 'Full Node' : 'Pruned')}
              {this.renderRowWithColumn('Device At Block', this.state.bitcoinBlockchainInformation.blocks)}
              {this.renderRowWithColumn('Network Block', this.state.bitcoinBlockchainInformation.headers)}
              {this.renderRowWithColumn('Peer Connection', 'No Data')}
              {this.renderRowWithColumn('Tx in Mempool', 'No Data')}
              {this.renderRowWithColumn('Minimym Relay Fee', 'No Data')}
              {this.renderRowWithColumn('Public IP Address', 'No Data')}
              {this.renderRowWithColumn('Device ID', 'No Data')}
              {this.renderRowWithColumn('Device Version', 'No Data')}
            </Grid>
            </Panel.Body>        
        </Panel>
    )
  }
}