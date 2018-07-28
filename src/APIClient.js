import config from './config'

export default class APIClient {

    static _fetchJSON(method) {
        const clientInfo = config
        console.log(clientInfo)
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
                if (responseJSON.statusCode !== undefined) {
                    console.log('SUCCESS WITH STATUS CODE: ' +  method)
                    reject(responseJSON)
                } else {
                    console.log('SUCCESS: ' +  method)
                    resolve(responseJSON)
                }
            }).catch((error) => {
                console.log('ERROR: ' +  method)
                reject(error)
            })
        })
    }

    static getBitseedDeviceData() {
        return new Promise((resolve, reject) => {
            fetch('./serial', {
                method: 'GET',
            })
            .then((response) => {
                return response.json()
            })
            .then((responseJSON) => {
                resolve(responseJSON)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    static getBlockchainInformation() {
        return APIClient._fetchJSON('getblockchaininfo')
    }

    static getNetworkInfo() {
        APIClient._fetchJSON('getnetworkinfo').then((data) => console.log(data))
        return APIClient._fetchJSON('getnetworkinfo')
    }

    static getMempoolInfo() {
        return APIClient._fetchJSON('getmempoolinfo')
    }

    static getPingResult() {
        return APIClient._fetchJSON('ping')
    }

    static stopDaemon() {
        return APIClient._fetchJSON('stop')
    }

}

const responses = {
    bitcoinServerAuthenticationProvidedInvalid: 'The provided credentials are not authorized to access this server.',
    bitcoinServerStopping: 'Bitcoin server stopping'
}