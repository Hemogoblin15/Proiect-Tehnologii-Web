const Utils = require("../utils");
const { setLessonNumber } = require("../lessonSelector");
let learnController = {};

learnController.learnGet = (req, res) => {
  Utils.sendResources(req, res, "views/learn.html");
};

learnController.chooseLesson = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", async () => {
    switch (lessonNumber) {
      case 1:
        Utils.redirectTo("/lesson1", res);
      case 2:
        Utils.redirectTo("/lesson2", res);
      case 3:
        Utils.redirectTo("/lesson3", res);
      case 4:
        Utils.redirectTo("/lesson4", res);
    }
  });
};

// learnController.learnPost = (req, res) => {
//     var body = "";
// }

module.exports = learnController;
