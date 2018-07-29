import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import APIClient from './APIClient'
import Header from './Header'
import AlertServerNotRunning from './Common/AlertServerNotRunning'
import Bitcoin from './Bitcoin'
import Electrum from './Electrum'
import Explorer from './Explorer'
import Settings from './Settings'

class App extends Component {

  constructor() {
    super()
    this.state = { showServerAlert: false }
    this.communicateWithBitseedServer = this.communicateWithBitseedServer.bind(this)
    this.communicateWithBitseedServer()
  }

  communicateWithBitseedServer() {
    APIClient.getBitseedWebUIServerStatus().then((response) => {
      this.setState({showServerAlert: false})
    }).catch((error) => {
      this.setState({showServerAlert: true})
    })
  }

  render() {
    return(
      <Router> 
        <React.Fragment>       
        <Header />
        { this.state.showServerAlert && <AlertServerNotRunning retryButtonAction={this.communicateWithBitseedServer}/>}
        <Switch>
        <Route exact path='/bitcoin' component={Bitcoin} />
        <Route exact path='/electrum' component={Electrum} />
        <Route exact path='/explorer' component={Explorer} />
        <Route exact path='/settings' component={Settings} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }
}

export default App