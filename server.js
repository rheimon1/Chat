const { render } = require('ejs')
const express = require('express')
const path = require('path')

const app = express()
// define o protocolo http
const server = require('http').createServer(app)
// protocolo web server
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) =>{
    res.render('index.html')
})

let messages = []


io.on('connection', socket =>{
    console.log(`Socket conectado ${socket.id}`)

    // para enviar apenas para um cliente
    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data=>{
        messages.push(data)
        // envia para todos os sockets da app
        socket.broadcast.emit('receiveMessage', data)

    })

})

server.listen(2828)