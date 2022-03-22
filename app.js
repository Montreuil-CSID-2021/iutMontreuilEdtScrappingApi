// Modules
const socket_io = require('socket.io')
const http = require('http')
const EventEmitter = require('events')

// Class
const Scrapper = require("./edt/Scrapper")
const EdtCredential = require("./edt/EdtCredential")
const Logs = require('./commons/Logs')
const LiteUser = require('./edt/LiteUser')
const EdtDay = require('./edt/EdtDay')

// Fichier config
const config = require("./config.json")

// Instantiation du Scrapper
let scrapper = new Scrapper()

// scrapper.scrapAll(new EdtCredential(config.autonomousCache.credential.username, config.autonomousCache.credential.password)).then(data => console.log(data))

// Démarrage du serveur WEB - Socket IO
const server = http.createServer()
const io = socket_io(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    Logs.info('Connexion web socket : ' + socket.id)

    socket.on('loginForWeb', async (/** EdtCredential */credentials) => {
        let event = new EventEmitter()

        scrapper.scrapForWeb(credentials, event)

        event.once('login', (/** LiteUser */ user) => {
            if(user) {
                socket.emit('login', user)
                event.on('update', (/** EdtDay[] */ days) => {
                    socket.emit('update', days)
                })
            } else {
                socket.emit('login', null)
            }
        })
    })
})

server.listen(config.server.port, () => {
    Logs.info(`Serveur connecté sur le port ${config.server.port}`)
})