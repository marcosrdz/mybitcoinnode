import React, { Component } from 'react'
import Configuration from './Configuration'
import BitcoinSettingsPanel from './Panels/BitcoinSettingsPanel'

export default class Settings extends Component {

  openFile() {
    Configuration.openConfigurationFile().then((data) => {
      console.log(data)
    }).catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <div>
        {this.openFile()}
        <BitcoinSettingsPanel />
      </div>
    )
  }
}