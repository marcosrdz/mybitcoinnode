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

    if (request.method === 'POST') {
        if (request.url === '/configuration') {
            let body = ''
            request.on('data', chunk => {
                body += chunk.toString()
            })
            request.on('end', () => {
                const { protocol, host, rpcuser, rpcpassword, port } = JSON.parse(body)
                const data = JSON.stringify({ 
                    protocol: protocol, 
                    host: host, 
                    rpcuser: rpcuser, 
                    rpcpassword: rpcpassword 
                })
                fs.writeFile("config.json", data, (err) => {
                    if (err) throw err
                    console.log(`${request.method} Request: ${request.url} : ${data.toString()}`)
                    response.statusCode = 200
                    response.end()
                })
            })
        } 
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