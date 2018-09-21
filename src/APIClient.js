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

    static updateBitcoinConfigurationFile(newData) {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/bitcoinConf', {
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
        if (useSampleJSON) { return Promise.resolve(require(`./sampleJSON/${method}.json`))}

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
                        console.log('ERROR WITH STATUS CODE: ' +  responseJSON.statusCode)
                        reject(responseJSON)
                    } else {
                        console.log('SUCCESS: ' +  method)
                        resolve(responseJSON)
                    }
                }).catch((error) => {
                    console.log('ERROR: ' +  method)
                    console.log('ERROR: ' +  error)
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

    static getBitcoinConf() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3001/bitcoinConf', {
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

    static getBlockCountFromBlockExplorer() {
        return new Promise((resolve, reject) => {
            fetch('https://blockexplorer.com/api/status?q=getBlockCount', {
                method: 'GET'
            })
            .then((response) => {
                return response.json()
            })
            .then((responseJSON) => {
                console.log('SUCESS: getblockchaininfo')
                resolve(responseJSON)
            }).catch((error) => {
                console.log('ERROR: getblockchaininfo')
                console.log('ERROR: ' +  error)
                reject(error)
            })
        })
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

const useSampleJSON = false