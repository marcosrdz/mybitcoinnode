import React, { Component } from 'react'
import BitseedSettingsPanel from './Panels/BitseedSettingsPanel'
import BitcoinSettingsPanel from './Panels/BitcoinSettingsPanel'

export default class Settings extends Component {

  render() {
    return (
      <div>
        <BitseedSettingsPanel />
        <BitcoinSettingsPanel />
      </div>
    )
  }
  
}