#!/usr/bin/env node
const http = require('http')
const fs = require('fs')
const os = require('os')
const sysInfo = require('systeminformation')
const webSocket = require('websocket').server

/* Device Uptime*/
const moment = require("moment")
require("moment-duration-format")
const uptimeFormat = "w [weeks], d [days], h [hours], m [minutes]"
/* */

/* Local IP and MAC Address */
const networkInterfaces = os.networkInterfaces()
const localInterface = (Object.keys(networkInterfaces)
    .map(x => networkInterfaces[x]
    .filter(x => x.family === 'IPv4' && !x.internal)[0])
    .filter(x => x)[0])
const macAddress = localInterface.mac
const localAddress = localInterface.address
/* */

/* Disk Size */
let diskSize = 'No Data'
let diskSpaceUsed = 'No Data'
let diskSpaceAvailable = 'No Data'

sysInfo.fsSize().then(response => {
    diskSize = formatBytes(response[0].size)
    diskSpaceUsed = `${formatBytes(response[0].used)} (${response[0].use}%)`
    diskSpaceAvailable = formatBytes(response[0].size - response[0].used)
})
/* */

/* RAM */
let ramUsed = 'No Data'
let ramFree = 'No Data'

sysInfo.mem().then(response => {
    ramUsed = formatBytes(response.used)
    ramFree = formatBytes(response.free)
})
/*  */

/* CPU Load */
let cpuLoad = 'No Data'

sysInfo.currentLoad().then(response => {
    cpuLoad = `${response.avgload}`
})
/* */

function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
console.log('Bitseed Web UI server is now running. Waiting for requests...')
const server = http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    console.log(`${request.method} Request: ${request.url}`)
    if (request.method === 'POST') {
        if (request.url === '/configuration') {
            let body = ''
            request.on('data', chunk => {
                body += chunk.toString()
            })
            request.on('end', () => {
                const parsedJSON = JSON.parse(body)                
                
                const protocol = parsedJSON.webUIBitcoinRPCProtocol,
                    host = parsedJSON.webUIBitcoinRPCHost, 
                    port = parsedJSON.webUIBitcoinRPCPort, 
                    rpcuser = parsedJSON.webUIBitcoinRPCUser, 
                    rpcpassword = parsedJSON.webUIBitcoinRPCPassword, 
                    bitcoinConfAbsolutePath = parsedJSON.webUIBitcoinConfAbsolutePath 

                fs.readFile("config.json", 'utf8', (error, existingData) => {
                    if (error) {
                        const newData = JSON.stringify({
                            port: port, 
                            protocol: protocol, 
                            host: host, 
                            username: rpcuser, 
                            password: rpcpassword,
                            bitcoinConfAbsolutePath: bitcoinConfAbsolutePath 
                        })
                        fs.writeFile("config.json", newData, (err) => {
                            if (err) throw err
                            console.log(`${request.method} Request: ${request.url} : ${newData.toString()}`)
                            response.statusCode = 200
                            response.end(newData)
                        })
                    } else {
                        const updatedData = JSON.stringify({
                            port:  port === undefined || port !== existingData.port ? port : existingData.port, 
                            protocol: protocol === undefined || protocol !== existingData.protocol ? protocol : existingData.protocol, 
                            host: host === undefined || host !== existingData.host ? host : existingData.host, 
                            username: rpcuser === undefined || rpcuser !== existingData.rpcuser ? rpcuser : existingData.rpcuser, 
                            password: rpcpassword === undefined || rpcpassword !== existingData.rpcpassword ? rpcpassword : existingData.rpcpassword, 
                            bitcoinConfAbsolutePath: bitcoinConfAbsolutePath === undefined || bitcoinConfAbsolutePath !== existingData.bitcoinConfAbsolutePath ? bitcoinConfAbsolutePath : existingData.bitcoinConfAbsolutePath, 
                        })
                        fs.writeFile("config.json", updatedData, (err) => {
                            if (err) throw err
                            console.log(`${request.method} Request: ${request.url} : ${updatedData.toString()}`)
                            response.statusCode = 200
                            response.end(updatedData)
                        })
                    }

                }) 
            })
        } else if (request.url === '/bitcoinConf') {
            let body = ''
            request.on('data', chunk => {
                body += chunk.toString()
            })
            request.on('end', () => {
                const parsedJSON = JSON.parse(body)                
                
                const bitcoinConfPath = parsedJSON.bitcoinConfPath,
                    rpcuser = parsedJSON.rpcuser, 
                    rpcpassword = parsedJSON.rpcpassword

                fs.readFile(bitcoinConfPath, 'utf8', (error, existingData) => {
                    if (error) {
                        const newData = `
                            rpcport=8332 \n
                            rpcuser = ${rpcuser} \n 
                            rpcpassword = ${rpcpassword}
                            `
                        fs.writeFile(bitcoinConfPath, newData, (err) => {
                            if (err) throw err
                            console.log(`${request.method} Request: ${request.url} : ${newData.toString()}`)
                            response.statusCode = 200
                            response.end(newData)
                        })
                    } else {
                    const updatedData = JSON.stringify({
                        bitcoinConfPath:  bitcoinConfPath === undefined || bitcoinConfPath !== existingData.bitcoinConfPath ? bitcoinConfPath : existingData.bitcoinConfPath, 
                        rpcuser: rpcuser === undefined || rpcuser !== existingData.rpcuser ? rpcuser : existingData.rpcuser, 
                        rpcpassword: rpcpassword === undefined || rpcpassword !== existingData.rpcpassword ? rpcpassword : existingData.rpcpassword, 
                    })

                    let configurationFile = fs.readFileSync(bitcoinConfPath, "utf8").split('\n')
                    for (const [index, value] of configurationFile.entries()) {
                        if (value.startsWith('rpcuser=')) {
                            configurationFile[index] = `rpcuser=${rpcuser}`
                        } else if (value.startsWith('rpcpassword=')) {
                            configurationFile[index] = `rpcpassword=${rpcpassword}`
                        }
                    }

                    fs.writeFile(bitcoinConfPath, configurationFile.join('\n'), (err) => {
                        if (err) throw err
                        console.log(`${request.method} Request: ${request.url} : ${updatedData.toString()}`)
                        response.statusCode = 200
                        response.end(updatedData)
                    })
                }
            })
        })}
    } else if (request.method === 'GET') {
        if (request.url === '/configuration') {
            response.setHeader('Content-Type', 'application/json')
            response.statusCode = 200
        
            fs.readFile("config.json", 'utf8', (error, data) => {
                if (error) throw error
                console.log(`${request.method} Request: ${request.url} : ${data.toString()}`)
                response.end(data)
            }) 
        } else if (request.url === '/serial') {
            response.setHeader('Content-Type', 'text/plain')
            response.statusCode = 200
        
            fs.readFile("serial", 'utf8', (error, data) => {
                if (error) throw error
                console.log(`${request.method} Request: ${request.url} : ${data.toString()}`)
                response.end(data)
            }) 
        } else if (request.url === '/status') {
            response.setHeader('Content-Type', 'application/json')
            response.statusCode = 200
            response.end(JSON.stringify({ status: 'ok'}))
        } else if (request.url === '/deviceInformation') {
            response.setHeader('Content-Type', 'application/json')
            response.statusCode = 200
            response.end(JSON.stringify({
                uptime: moment.duration(os.uptime(), "seconds").format(uptimeFormat),
                localAddress: localAddress,
                macAddress: macAddress,
                diskSize: diskSize,
                diskSpaceUsed: diskSpaceUsed,
                diskSpaceAvailable: diskSpaceAvailable,
                ramUsed: ramUsed,
                ramFree: ramFree,
                cpuLoad: cpuLoad
            }))
        } else if (request.url === '/bitcoinConf') {
            response.setHeader('Content-Type', 'application/json')
            let configurationFile = fs.readFileSync("./bitcoin.conf", "utf8").split('\n')

            let confJSON = { bitcoinConfPath: './bitcoin.conf'}
            for (const [index, value] of configurationFile.entries()) {
                if (value.startsWith('rpcuser=')) {
                    confJSON.rpcuser = value.split('rpcuser=')[1]
                } else if (value.startsWith('rpcpassword=')) {
                    confJSON.rpcuser = value.split('rpcpassword=')[1]
                }
            }

            response.statusCode = 200
            response.end(JSON.stringify(confJSON))
        }
    } else {
        response.statusCode = 501
        response.end('Invalid Request')
    }
}).listen(3001)

/* Websocket */

wsServer = new webSocket({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
})

function originIsAllowed(origin) {
  return true
}

wsServer.on('request', (request) => {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject()
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.')
      return
    }
    
    const connection = request.accept('echo-protocol', request.origin)
    
    console.log((new Date()) + ' Connection accepted.')
    
    connection.on('message', (message) => {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    })

    connection.on('close', (reasonCode, description) => {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    })
})

/* */