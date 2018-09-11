import React, { Component } from 'react'
import BitseedSettingsPanel from './Panels/BitseedSettingsPanel'
import BitcoinSettingsPanel from './Panels/BitcoinSettingsPanel'
import { TabContent, TabPane } from 'reactstrap'

export default class Settings extends Component {

  render() {
    return (
      <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
      {/* <TabContent activeTab={1}>
        <Tab eventKey={1} title="Bitseed">
          <BitseedSettingsPanel />
        </Tab>
        <Tab eventKey={2} title="Bitcoin">
          <BitcoinSettingsPanel />
        </Tab>
      </TabContent> */}
      </div>
    )
  }
  
}