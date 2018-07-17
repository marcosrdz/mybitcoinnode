

import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import APIClient from './APIClient'

export default class Server extends Component {

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

  renderRowWithColumn(title, description) {
    return(
      <Row className="show-grid">
        <Col xs={1} md={4}></Col>
        <Col xs={4} md={4}>
        {title}
        </Col>
        <Col xs={4} md={4}>
        {description}
        </Col>
        <Col xs={1} md={4}></Col>
      </Row>
    )
  }

  render() {
    return (
        <div >
          <Grid>
            {this.renderRowWithColumn('Bitcoin Core Version','Version')}
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
       </div>
    )
  }
}