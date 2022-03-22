class LiteUser {
    /**
     * @param user {User}
     */
    constructor(user) {
        this.username = user.username;
        this.defaultEdt = user.defaultEdt;
    }
}

module.exports = LiteUser