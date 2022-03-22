import User from "./User";

export default class LiteUser {
    username: string
    defaultEdt: string

    constructor(user: User) {
        this.username = user.username;
        this.defaultEdt = user.defaultEdt;
    }
}