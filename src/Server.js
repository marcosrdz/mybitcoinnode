

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
    this.state = {bitcoinBlockchainInformation: {}}
    this.getBlockchainInformation()
  }


  render() {
    return (
        <div >
          <Grid>
  <Row className="show-grid">
    <Col xs={12} md={8}>
      Bitcoin Core Version
    </Col>
    <Col xs={6} md={4}>
      Version
    </Col>
  </Row>

  <Row className="show-grid">
    <Col xs={6} md={4}>
      Node Type
    </Col>
    <Col xs={12} md={4}>
      { this.state.bitcoinBlockchainInformation.pruned === false ? 'Full Node' : 'Pruned'}
    </Col>
  </Row>

  <Row className="show-grid">
    <Col xs={6} xsOffset={6}>
      Device At Block
    </Col>
    <Col xs={6} md={4}>
    { this.state.bitcoinBlockchainInformation.blocks}
    </Col>
  </Row>

  <Row className="show-grid">
    <Col md={6} mdPush={6}>
      Network Block:
    </Col>
    <Col md={6} mdPull={6}>
    { this.state.bitcoinBlockchainInformation.headers}
    </Col>
  </Row>

  <Row className="show-grid">
    <Col md={6} mdPush={6}>
      Peer Connections:
    </Col>
    <Col md={6} mdPull={6}>
      Peer Connection 
    </Col>
  </Row>

    <Row className="show-grid">
    <Col md={6} mdPush={6}>
      Tx in Mempool:
    </Col>
    <Col md={6} mdPull={6}>
    Mempool
    </Col>
  </Row>

    <Row className="show-grid">
    <Col md={6} mdPush={6}>
      Minimum Relay Fee:
    </Col>
    <Col md={6} mdPull={6}>
    Fee
    </Col>
  </Row>


    <Row className="show-grid">
    <Col md={6} mdPush={6}>
    Public IP Address:
    </Col>
    <Col md={6} mdPull={6}>
    Public IP
    </Col>
  </Row>


    <Row className="show-grid">
    <Col md={6} mdPush={6}>
    Device ID:
    </Col>
    <Col md={6} mdPull={6}>
    ID
    </Col>
  </Row>

  <Row className="show-grid">
    <Col md={6} mdPush={6}>
    Device Version:
    </Col>
    <Col md={6} mdPull={6}>
    Version
    </Col>
  </Row>

</Grid>
       </div>
    )
  }
}