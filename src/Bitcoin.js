import React, { Component } from 'react'
import BitcoinPanel from './Panels/BitcoinPanel'
import AddressesPanel from './Panels/AddressesPanel'

export default class Bitcoin extends Component {
  render() {
    return (
      <div>
        <BitcoinPanel />
        <AddressesPanel />
      </div>
    )
  }
}
