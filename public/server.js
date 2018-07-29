const http = require('http')
const fs = require('fs')

http.createServer((request, response) => {
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
        }
    } else {
        response.statusCode = 501
        response.end('Invalid Request')
    }
}).listen(3001)
