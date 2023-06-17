var url = require("url");
var fs = require("fs");
const bcrypt = require("bcrypt");
var MongoClient = require("mongodb").MongoClient;

const mongoURL = "mongodb+srv://mihail:mama@cluster0.aip4z87.mongodb.net/";
const dbName = "MaMa!";

function handleRegisterRequest(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { firstName, lastName, email, password } = parseFormData(body);
    const userByEmail = await findUserByEmail(email);

    if (userByEmail) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(`
        <script>
          alert("Adresa de email exista deja !!!");
          window.location.href = "/register";
        </script>
      `);
      res.end();
    } else {
      await insertUser(firstName, lastName, email, password);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(`
        <script>
          alert("Contul a fost creat cu succes !!!");
          window.location.href = "/";
        </script>
      `);
      res.end();
    }
  });
}

async function findUserByEmail(email) {
  const client = new MongoClient(mongoURL);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection("users");

  const user = await collection.findOne({ email });

  client.close();

  return user;
}

async function insertUser(firstName, lastName, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = new MongoClient(mongoURL);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection("users");

  await collection.insertOne({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  client.close();
}

function parseFormData(formData) {
  const data = {};
  const formFields = formData.split("&");

  for (let i = 0; i < formFields.length; i++) {
    const [key, value] = formFields[i].split("=");
    data[key] = decodeURIComponent(value);
  }

  return data;
}

module.exports = handleRegisterRequest;
