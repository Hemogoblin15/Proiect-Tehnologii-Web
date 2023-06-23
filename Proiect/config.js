class Config {
    constructor() {
       this.dbURI = process.env.DB_URI
       this.dbName = process.env.DB_NAME
    } 
}

module.exports = Config