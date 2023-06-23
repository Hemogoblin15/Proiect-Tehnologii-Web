const Utils = require("../utils");

let homeController = {};

homeController.homeGet = (req, res) => {
  Utils.sendResources(req, res, "./views/home.html");
};
module.exports = homeController;