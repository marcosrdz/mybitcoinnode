import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'


export default class AlertServerNotRunning extends Component {
  render() {
    return (
      <div>
        <Alert bsStyle="danger">
          <h4>Bitseed Web Server is not reachable.</h4>
          <p>
            We were unable to communicate with the Bitseed Web Server. This server provides the information needed to display, and run some actions on your Bitseed Bitcoin node.
          </p>
          <p>
            You can start the server by running this command in the folder where the Bitseed Web UI is located: <strong>node server.js</strong>
          </p>
        </Alert>
      </div>
    )
  }
}
