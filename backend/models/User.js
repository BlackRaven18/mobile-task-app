
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./task.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

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

}

module.exports = User