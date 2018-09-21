import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './Header'
import AlertServerNotRunning from './Common/AlertServerNotRunning'
import Bitcoin from './Bitcoin'
import Lightning from './Lightning'
import Electrum from './Electrum'
import Explorer from './Explorer'
import Device from './Device'
import GeneralSettings from './GeneralSettings'

class App extends Component {

  constructor() {
    super()
    this.state = { showServerAlert: false }
    this.connectToWebsocket()
  }

  connectToWebsocket() {
    const ws = new WebSocket('ws://localhost:3001', 'echo-protocol')
    
    ws.onopen = () => {
      this.setState({showServerAlert: false})
    }
  
    ws.onclose = (e) => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
      this.setState({showServerAlert: true})
      setTimeout(() => {
        this.connectToWebsocket()
      }, 1000)
    }
  
    ws.onerror = (err) => {
      console.error('Socket encountered error: ', err.message, 'Closing socket')
      this.setState({showServerAlert: true})
      ws.close()
    }

  }
  
  render() {
    return(
      <Router> 
        <React.Fragment>       
        <Header />
        <br />  
          <AlertServerNotRunning renderAlert={this.state.showServerAlert}/>
        <br />
        <Switch>
        <Route exact path='/bitcoin' component={Bitcoin} />
        <Route exact path="/" component={() => <Redirect to="/bitcoin" />}/>
        <Route exact path='/lightning' component={Lightning} />
        <Route exact path='/electrum' component={Electrum} />
        <Route exact path='/explorer' component={Explorer} />
        <Route exact path='/device' component={Device} />
        <Route exact path='/generalSettings' component={GeneralSettings} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }
}

export default App