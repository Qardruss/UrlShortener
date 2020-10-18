const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs')
const YAML = require('yaml')

const Config = YAML.parse(fs.readFileSync("Config.yml", 'utf8'))

function Random(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

app.use(express.static('public'));

http.listen(8000, '0.0.0.0', () => {
    console.log('listening on *:8000');
});

io.on('connection', function(socket) {
    socket.on("create", function(link) {
        let short = Random(Config.url_length)
        while (fs.existsSync(`public/l/${short}`)) {
            short = Random(Config.url_length)
        }
        fs.mkdirSync(`public/l/${short}`)
        fs.writeFileSync(`public/l/${short}/index.html`, `<script>window.location.href="${link}"</script>`)
        socket.emit("response", short)
    })
})