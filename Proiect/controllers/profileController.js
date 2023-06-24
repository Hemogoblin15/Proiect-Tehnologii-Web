const fs = require("fs");
const Utils = require("../utils");
const User = require("../models/userModel")

let profileController = {};

profileController.profileGet = async (req, res) => {
  let user = await User.findByEmail("pletosu209@gmail.com");
  fs.readFile("./views/profile.html", "utf8", (err, data) => {
    if (user === null) {
      console.error("Error reading profile.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let profilePage = data
        .replace("{{name}}", user.name)
        .replace("{{country}}", user.country)
        .replace("{{ocupation}}", user.ocupation)
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(profilePage);
    }
  });
};

module.exports = profileController;
