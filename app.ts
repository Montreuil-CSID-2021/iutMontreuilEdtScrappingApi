// Modules
import * as http from 'http'
import EventEmitter from 'events'
import {Socket} from "socket.io"

// Class
import Scrapper from "./edt/Scrapper"
import Logs from './commons/Logs'
import LiteUser from './edt/LiteUser'
import EdtDay from './edt/EdtDay'

// Fichier config
import config from "./config.json"
import EdtCredential from "./edt/EdtCredential";
import CacheManager from "./edt/cache/CacheManager";

// Instantiation du questionnaire de cache
let cacheManager = new CacheManager()

// Instantiation du Scrapper
let scrapper = new Scrapper(cacheManager)

// Démarrage du serveur WEB - Socket IO
const server = http.createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket: Socket) => {
    Logs.info('Connexion web socket : ' + socket.id)

    socket.on('loginForWeb', async (credentials: EdtCredential) => {
        let event = new EventEmitter()

        scrapper.scrapForWeb(credentials, event)

        event.once('login', (user: LiteUser) => {
            if(user) {
                socket.emit('login', user)
                event.on('update', (days: Array<EdtDay>) => {
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