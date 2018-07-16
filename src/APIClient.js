export default class APIClient {

    static fetchJSON(method, handler) {
        fetch(clientInfo.protocol + '://' + clientInfo.host + ':' + clientInfo.port, {
            method: 'POST',
            body: JSON.stringify({ method: method }),
            headers: 
            {
                "Content-Type": "text/plain",
                'Authorization': 'Basic Yml0Y29pbnJwYzpiaXRzZWVk'
            }
        }).then((response,error) => {
            return response.json()
        }).then((data) => {
            handler(data)
        })
    }

    static getBlockchainInformation(handler) {
        return APIClient.fetchJSON('getblockchaininfo', handler)
    }

}

const clientInfo = {
    protocol: 'http',
    host: 'localhost:1337/192.168.1.10',
    username: 'bitcoinrpc',
    password: 'bitseed',
    port: '8332'
  }