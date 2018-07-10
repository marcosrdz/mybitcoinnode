import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Server from './Server'
import Wallet from './Wallet'
import Header from './Header'

class App extends Component {
  render() {
    return(
      <Router> 
        <React.Fragment>       
        <Header />
        <Switch>
        <Route exact path='/server' component={Server} />
        <Route exact path='/wallet' component={Wallet} />
          </Switch>
        </React.Fragment>
      </Router>
    )
  }
}

export default App