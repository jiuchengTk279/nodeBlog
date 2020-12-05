// www.js  server 技术相关
// createServer 创建服务相关的内容
const http = require('http')

const PORT = 8000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)
server.listen(PORT)
