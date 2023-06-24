const getDb = require('../database').getDb


class User {
    constructor(firstName, lastName, country, occupation, email, password) {
        this.name = firstName + " " + lastName
        this.country = country
        this.occupation = occupation
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

    static findById(id) {
        const db = getDb()
        const collection = db.collection('users');
        const user = collection.findOne({ _id : id});
        return user;
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