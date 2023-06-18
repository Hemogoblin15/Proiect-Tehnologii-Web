require ('dotenv').config();
var url = require("url");
var fs = require("fs");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const mongoURI =process.env.DB_URI;
const dbName = process.env.DB_NAME;

function generateToken() {
  return uuidv4();
}

function handleLoginRequest(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { email, password } = parseFormData(body);
    const user = await findUser(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken();
      res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.write(`
        <script>
          localStorage.setItem('token', '${token}');
          alert("Te-ai logat cu succes");
          window.location.href = "/home";
        </script>
      `);
      res.end();
    } else {
      res.setHeader("Content-Type", "text/html");
      res.write(`
        <script>
          alert("Ati introdus gresit email-ul sau parola !!!");
          window.location.href = "/";
        </script>
      `);
      res.end();
    }
  });
}

async function findUser(email) {
  const client = new MongoClient(mongoURI);
  await client.connect();

  const db = client.db(dbName);
  const collection = db.collection("users");

  const user = await collection.findOne({ email });

  client.close();

  return user;
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

module.exports = handleLoginRequest;
