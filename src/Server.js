import React, { Component } from 'react'
const Bitcoin = require('bitcoin-core')

export default class Server extends Component {
  render() {
    const client = new Bitcoin({ 
        host: '192.168.1.10',
        username: 'bitcoinrpc',
        password: 'bitseed',
        port: '8332',
        ssl: { enabled: false }
    })

    return (
        <div>
        Server
       </div>
    )
  }
}
