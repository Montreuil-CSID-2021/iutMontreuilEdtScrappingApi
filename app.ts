// Modules
import express from "express"
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
import {isContext} from "vm";
import {isCryptoKey} from "util/types";

// Instantiation du questionnaire de cache
let cacheManager = new CacheManager()

// Instantiation du Scrapper
let scrapper = new Scrapper(cacheManager)

// Serveur express
const app = express()
app.set('port', config.server.port)

// Serveur Http
const server = new http.Server(app)

// Serveur Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Route Socket.io
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

// Route express
app.get("/edt", (req, res) => {
    let token = req.headers["token"]?.toString()
    if(token) {
        if(config.token.includes(token)) {
            let days = cacheManager.getEdtByName(config.autonomousCache.edt)
            if(days) res.json({
                edt: config.autonomousCache.edt,
                days: days
            })
            else return res.sendStatus(404)
        } else res.sendStatus(403)
    } else res.sendStatus(401)
})

// Allumage du serveur
server.listen(config.server.port, () => {
    Logs.info(`Serveur connecté sur le port ${config.server.port}`)
})