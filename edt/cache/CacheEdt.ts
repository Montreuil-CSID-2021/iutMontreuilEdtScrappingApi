import EdtDay from "../EdtDay";

export default class CacheEdt {
    name: string
    expireDate: Date
    days: Array<EdtDay>

    constructor(name: string, expireDate: Date, days: Array<EdtDay>) {
        this.name = name;
        this.expireDate = expireDate;
        this.days = days;
    }
}