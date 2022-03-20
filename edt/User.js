class User {
    /**
     * @param username {string}
     * @param password {string}
     * @param defaultEdt {string}
     */
    constructor(username, password, defaultEdt) {
        this._username = username;
        this._encryptPassword = password;
        this._defaultEdt = defaultEdt;
    }

    get username() {
        return this._username;
    }

    get encryptPassword() {
        return this._encryptPassword;
    }

    get defaultEdt() {
        return this._defaultEdt;
    }
}

module.exports = User
