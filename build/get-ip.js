var os = require('os')
var ip = '' 
ifaces = os.networkInterfaces() // 获取本机ip
for (var i in ifaces) {
    for (var j in ifaces[i]) {
        var val = ifaces[i][j]
        if (val.family === 'IPv4' && val.address !== '127.0.0.1') {
            ip = val.address
            break
        }
    }
}
module.exports = ip