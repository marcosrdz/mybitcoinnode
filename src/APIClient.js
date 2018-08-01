export default class APIClient {

    static fetchConfigurationFile() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/configuration').then(response => {
                return response.json()
            }).then(responseJSON => {
                resolve(responseJSON)
            }).catch(error => {
                reject(error)
            })
        }) 
    }

    static updateConfigurationFile(newData) {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/configuration', {
                method: 'POST',
                body: JSON.stringify(newData),
                headers:
                {
                    'Accept': 'application/json',
                }
            }).then(response => {
                console.log(response)
                return response.json()
            }).then(responseJSON => {
                resolve(responseJSON)
            }).catch(error => {
                reject(error)
            })
        }) 
    }

    static _fetchJSON(method) {
        return Promise.all([APIClient.fetchConfigurationFile()]).then((results) => { 
            const clientInfo = results[0]
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
                        console.log('ERROR WITH STATUS CODE: ' +  method)
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
        })
    }

    static getBitseedWebUIServerStatus() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/status', {
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

    static getDeviceInformation() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/deviceInformation', {
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

    static getBitseedDeviceSerial() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/serial', {
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