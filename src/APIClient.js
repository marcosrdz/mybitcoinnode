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

    static getNetworkInfo(handler) {
        return APIClient.fetchJSON('getnetworkinfo', handler)
    }

    static getMempoolInfo(handler) {
        return APIClient.fetchJSON('getmempoolinfo', handler)
    }

    static getPingResult(handler) {
        return APIClient.fetchJSON('ping', handler)
    }

    static stopDaemon(handler) {
        return APIClient.fetchJSON('stop', handler)
    }

}

const clientInfo = {
    protocol: 'http',
    host: 'localhost:1337/192.168.1.10',
    username: 'bitcoinrpc',
    password: 'bitseed',
    port: '8332'
}
const responses = {
    bitcoinServerStopping: 'Bitcoin server stopping'
}