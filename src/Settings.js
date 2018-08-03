import React, { Component } from 'react'
import BitseedSettingsPanel from './Panels/BitseedSettingsPanel'
import BitcoinSettingsPanel from './Panels/BitcoinSettingsPanel'
import { Tabs, Tab } from 'react-bootstrap'

export default class Settings extends Component {

  render() {
    return (
      <div style={{ width: '600px',   marginLeft: 'auto', marginRight: 'auto', textAlign: 'left'}}>
        <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Bitseed">
            <BitseedSettingsPanel />
          </Tab>
          <Tab eventKey={2} title="Bitcoin">
            <BitcoinSettingsPanel />
          </Tab>
          <Tab eventKey={3} title="Tab 3" disabled>
            Tab 3 content
          </Tab>
        </Tabs>
      </div>
    )
  }
  
}