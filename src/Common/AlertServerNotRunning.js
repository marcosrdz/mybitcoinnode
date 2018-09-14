import React, { Component } from 'react'
import { Alert, Fade } from 'reactstrap'


export default class AlertServerNotRunning extends Component {

  state = { renderAlert: false }

  static getDerivedStateFromProps(props) {
     return { renderAlert: props.renderAlert }
  }

  render() {

    return (
      <Fade in={this.state.renderAlert}>
      {this.state.renderAlert &&
      <div style={{marginRight: '5em', marginLeft: '5em'}}>
        <Alert color="danger">
          <h4>Bitseed Web Server is not reachable.</h4>
          <p>
            We were unable to communicate with the Bitseed Web Server. This server provides the information needed to display, and run some actions on your Bitseed Bitcoin node.
          </p>
          <p>
            You can start the server by running this command in the folder where the Bitseed Web UI is located: <strong>node server.js</strong>
          </p>
        </Alert>
        </div>
      }
      </Fade>
    )
  }
}
