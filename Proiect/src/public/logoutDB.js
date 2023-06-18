require ('dotenv').config();
const { MongoClient } = require("mongodb");
const mongoURI =process.env.DB_URI;
const dbName = process.env.DB_NAME;
var cookie = require("cookie");

async function handleLogoutRequest(req, res){
    const user = await findUser(getToken(req));
    await updateToken(user._id);
    res.setHeader(
        "Set-Cookie",
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      );
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
}

function getToken(req) {
    var cookies = cookie.parse(req.headers.cookie || "");
      return cookies.token;
  }

async function findUser(token) {
    const client = new MongoClient(mongoURI);
    await client.connect();
  
    const db = client.db(dbName);
    const collection = db.collection("users");
  
    const user = await collection.findOne({ token });
  
    client.close();
  
    return user;
  }

async function updateToken(userId) {
    const client = new MongoClient(mongoURI);
    await client.connect();
  
    const db = client.db(dbName);
    const collection = db.collection('users');
  
    await collection.updateOne({ _id: userId }, { $set: { token: null } });
  
    client.close();
  }

module.exports = handleLogoutRequest;