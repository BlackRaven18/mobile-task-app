const db = require('../database');

class User {

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    save() {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO user (username, password) VALUES (?, ?)");
            stmt.run(this.username, this.password, (err) => {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        reject(new Error('User with that username already exists'));
                    }

                    reject(new Error(err.message));
                }
                else {
                    console.log("User created");
                    resolve();
                }
            })
        })
    }

    static find(username) {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("SELECT username, password FROM user WHERE username = ?");
            stmt.get(username, (err, row) => {
                if (err) {
                    reject(new Error(err.message));
                }
                else if (row === undefined) {
                    reject(new Error('User not found'));
                }
                else {
                    resolve(new User(row.username, row.password));
                }
            })
        })
    }
}

module.exports = User