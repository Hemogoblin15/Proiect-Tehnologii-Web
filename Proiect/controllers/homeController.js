const Utils = require("../utils");

let homeController = {};

homeController.homeGet = (req, res) => {
  Utils.sendResources(req, res, "./views/home.html");
};

homeController.aboutGet = (req, res) => {
  Utils.sendResources(req, res, "./views/about.html");
}
module.exports = homeController;