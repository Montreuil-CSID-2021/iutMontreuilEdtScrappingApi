import CacheEdt from "./CacheEdt";
import User from "../User";
import EdtDay from "../EdtDay";

export default class CacheManager {
    edts: Array<CacheEdt> = []

    addEdt(name: string, days: Array<EdtDay>) {
        this.removeEdtByName(name)
        let now = new Date()
        this.edts.push(new CacheEdt(name, new Date(now.getTime() + 7200000), days))
    }

    removeEdtByName(name: string) {
        this.edts = this.edts.filter((cacheEdt) => {
            return cacheEdt.name !== name
        })
    }

    getEdtByName(name: string): Array<EdtDay> {
        return this.edts.find(cacheEdt => cacheEdt.name === name && cacheEdt.expireDate >= new Date())?.days
    }
}