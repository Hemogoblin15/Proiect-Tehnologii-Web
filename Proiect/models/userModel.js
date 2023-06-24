const getDb = require('../database').getDb


class User {
    constructor(firstName, lastName, country, ocupation, email, password) {
        this.name = firstName + " " + lastName
        this.country = country
        this.ocupation = ocupation
        this.email = email
        this.password = password
        this.admin = false
    }

    save() {
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    static findAll() {
        const db = getDb()
        return db.collection('users').find().toArray()
    }


    static findByEmail(email) {
        const db = getDb()
        const collection = db.collection('users');
        const user = collection.findOne({ email});
        return user;
    }

    static remove(email) {
        const db = getDb()
        db.collection('users').deleteOne({ email })
    }
}

module.exports = User