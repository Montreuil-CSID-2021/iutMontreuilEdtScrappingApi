// - - - Node Module - - - //
import fs from "fs"

// - - - Import Class - - - //
import Utils from "./Utils"

// - - - Class de logs - - - //
export default class Logs
{
    private static logsDir = `${__dirname}/../Logs`

    private static writeLog(log: string) {
        let string_date = Utils.getStringDate()

        if(!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, 0o774)
        }

        let log_file = fs.createWriteStream(`${this.logsDir}/${string_date}.log`, {flags: 'a'})

        log_file.write(log + "\n")
    }

    static info(content: string) {
        let time = Utils.getStringDateAndTime()
        console.log('\x1b[37m' + time + ' \x1b[36minfo \x1b[37m: ' + content)
        this.writeLog(`${time} info : ${content}`)
    }

    static error(content: string|Error) {
        let time = Utils.getStringDateAndTime()
        console.log('\x1b[37m' + time + ' \x1b[31merror \x1b[37m: ' + content.toString())
        this.writeLog(`${time} error : ${content.toString()}`)
    }

    static warn(content: string) {
        let time = Utils.getStringDateAndTime()
        console.log('\x1b[37m' + time + ' \x1b[33mwarn \x1b[37m: ' + content)
        this.writeLog(`${time} warn : ${content}`)
    }
}
