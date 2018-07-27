import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './Header'
import Bitcoin from './Bitcoin'
import Electrum from './Electrum'
import Explorer from './Explorer'
import Settings from './Settings'

class App extends Component {
  render() {
    return(
      <Router> 
        <React.Fragment>       
        <Header />
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