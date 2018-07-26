const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
    if (request.method === 'POST') {
        if (request.url === '/configuration') {
            let body = ''
            request.on('data', chunk => {
                body += chunk.toString()
            })
            request.on('end', () => {
                const { protocol, host, rpcuser, rpcpassword, port } = JSON.parse(body)
                fs.writeFile ("config.json", JSON.stringify({ 
                    protocol: protocol, 
                    host: host, 
                    rpcuser: rpcuser, 
                    rpcpassword: rpcpassword 
                }), (err) => {
                        if (err) throw err
                        response.statusCode = 200
                        response.end()
                    }
                )
            })
        } 
    } else if (request.method === 'GET') {
        if (request.url === '/configuration') {
            response.setHeader('Content-Type', 'application/json')
            response.statusCode = 200
        
            fs.readFile("config.json", 'utf8', (error, data) => {
                if (error) throw error
                console.log(`GET Request: ${data.toString()}`)
                response.end(data)
            }) 
        }
    } else {
        response.statusCode = 501
        response.end('Invalid Request')
    }
}).listen(8080)
