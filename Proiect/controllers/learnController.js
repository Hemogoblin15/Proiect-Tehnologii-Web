const Utils = require("../utils");
//const { setLessonNumber } = require("../lessonSelector");
let learnController = {};

learnController.learnGet = (req, res) => {
  Utils.sendResources(req, res, "views/learn.html");
};

learnController.lessonGet = (req, res) => {
  let lesson = req.url.split('/')[2];
  Utils.sendResources(req, res, "views/lessons/" + lesson + ".html");  
};

module.exports = learnController;
