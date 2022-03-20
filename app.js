const Scrapper = require("./edt/Scrapper")
const EdtCredential = require("./edt/EdtCredential")
const config = require("./config.json")

let scrapper = new Scrapper()

scrapper.scrapAll(new EdtCredential(config.autonomousCache.credential.username, config.autonomousCache.credential.password)).then(data => console.log(data))
