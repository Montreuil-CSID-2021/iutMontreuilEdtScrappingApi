export default class User {
    readonly username: string
    readonly password: string
    readonly defaultEdt: string

    constructor(username: string, password: string, defaultEdt: string) {
        this.username = username;
        this.password = password
        this.defaultEdt = defaultEdt;
    }

    checkPassword(password: string): boolean {
        return this.password === password
    }
}
