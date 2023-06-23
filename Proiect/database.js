require('dotenv').config()

const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient

const Config = require("./config");

let _database

const mongodbConnect = (callback) => {
    const config = new Config();

    mongoClient
        .connect(
        config['dbURI'])
        .then(client => {
            _database = client.db(config['dbName'])
            console.log("[database] Connected to mongodb database!")
            callback()
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}

const getDb = () => {
    if(_database) {
        return _database
    }
    else {
        
        throw 'No database found!'
    }
}

exports.mongodbConnect = mongodbConnect
exports.getDb = getDb