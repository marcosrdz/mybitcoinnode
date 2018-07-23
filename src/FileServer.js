const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/configuration') {
        let body = ''
        request.on('data', chunk => {
            body += chunk.toString()
        })
        request.on('end', () => {
            const { rpcusername, rpcpassword } = JSON.parse(body)
            fs.writeFile ("config.json", JSON.stringify({ rpcusername: rpcusername, rpcpassword: rpcpassword}), (err) => {
                if (err) throw err
                response.end()
            })
        })
    } else {
        response.end()
    }
}).listen(8080)