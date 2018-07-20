export default class APIClient {

    static _fetchJSON(method) {
        return new Promise((resolve, reject) => {
            fetch(clientInfo.protocol + '://' + clientInfo.host + ':' + clientInfo.port, {
                method: 'POST',
                body: JSON.stringify({ method: method }),
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(clientInfo.username + ':' + clientInfo.password).toString('base64')
                }
            })
            .then((response) => {
                return response.json()
            })
            .then((responseJSON) => {
                console.log('SUCCESS: ' +  method)
                resolve(responseJSON)
            }).catch((error) => {
                console.log('ERROR: ' +  method)
                reject(error)
            })
        })
    }

    static getBlockchainInformation(handler) {
        return APIClient.fetchJSON('getblockchaininfo')
    }

    static getNetworkInfo(handler) {
        return APIClient.fetchJSON('getnetworkinfo')
    }

    static getMempoolInfo(handler) {
        return APIClient.fetchJSON('getmempoolinfo')
    }

    static getPingResult() {
        return APIClient._fetchJSON('ping')
    }

    static stopDaemon(handler) {
        return APIClient.fetchJSON('stop')
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
    bitcoinServerAuthenticationProvidedInvalid: 'The provided credentials are not authorized to access this server.',
    bitcoinServerStopping: 'Bitcoin server stopping'
}