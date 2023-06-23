const jwt = require("jsonwebtoken");
const Utils = require("../utils");
const User = require("../models/userModel")
const bcrypt = require('bcrypt')

require("dotenv").config();

let loginController = {};

loginController.loginGet = (req, res) => {
  Utils.sendResources(req, res, "./views/login.html");
};
loginController.registerGet = (req, res) => {
  Utils.sendResources(req, res, "./views/register.html");
};

loginController.loginPost = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end",  async () => {
        const { email, password } = parseFormData(body);
        const user = await User.findByEmail(email);
        if (bcrypt.compareSync(password, user.password)){
            let { token } = req.headers.cookie || "";
            if (token) {
                res.setHeader("Set-Cookie", "token=; Max-Age=0");
            }
            token = jwt.sign({ id: user._id}, process.env.JWT_KEY);
            res.setHeader(
              "Set-Cookie",
              `token=${token}; HttpOnly; Max-Age=${1 * 60 * 60 * 1000}`
            );
            Utils.redirectTo("/home", res);
        } else {
            res.statusCode = 401;
            res.end("Invalid credentials");
        }
  });
};

loginController.registerPost = (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", async () => {
        const {  firstName, lastName, country, ocupation, email, password } = parseFormData(body);
        const findUser = await User.findByEmail(email);
        if (findUser){
            res.statusCode = 401;
            res.end("An account using this email already exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User(firstName, lastName, country, ocupation, email, hashedPassword);
            user.save();
            res.statusCode = 302;
            Utils.redirectTo("/login", res);
            res.end();
        }
    });
};

loginController.logout = (req, res) => {
  res.setHeader("Set-Cookie", "token=; Max-Age=0");
  Utils.redirectTo("/login", res);
};

function parseFormData(formData) {
    const data = {};
    const formFields = formData.split("&");
  
    for (let i = 0; i < formFields.length; i++) {
      const [key, value] = formFields[i].split("=");
      data[key] = decodeURIComponent(value);
    }
  
    return data;
  }

module.exports = loginController;