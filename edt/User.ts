export default class User {
    username: string
    encryptPassword: string
    defaultEdt: string

    constructor(username: string, password: string, defaultEdt: string) {
        this.username = username;
        this.encryptPassword = password;
        this.defaultEdt = defaultEdt;
    }
}
