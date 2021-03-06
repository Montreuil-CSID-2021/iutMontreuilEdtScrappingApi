// - - - Class Utils - - - //
export default class Utils {
    /** Retourne la data et l'heure au format : JJ:MM:AAAA hh:mm */
    static getStringDateAndTime(): string {
        let date = new Date()

        let day = ("0" + date.getDate()).slice(-2)
        let month = ("0" + (date.getMonth() + 1)).slice(-2)
        let year = date.getFullYear()

        let hour = ("0" + date.getHours()).slice(-2)
        let minutes = ("0" + date.getMinutes()).slice(-2)
        let seconde = ("0" + date.getSeconds()).slice(-2)

        return `${year}-${month}-${day} ${hour}:${minutes}:${seconde}`
    }

    /** Retourne la data au format : JJ:MM:AAAA */
    static getStringDate():string {
        let date = new Date()

        let day = ("0" + date.getDate()).slice(-2)
        let month = ("0" + (date.getMonth() + 1)).slice(-2)
        let year = date.getFullYear()

        return `${year}-${month}-${day}`
    }
}
