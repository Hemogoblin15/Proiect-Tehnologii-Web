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
        Utils.redirectTo("/learn/lesson1", res);
      case 2:
        Utils.redirectTo("/learn/lesson2", res);
      case 3:
        Utils.redirectTo("/learn/lesson3", res);
      case 4:
        Utils.redirectTo("/learn/lesson4", res);
    }
  });
};
learnController.learnGet = (req, res) => {
  Utils.sendResources(req, res, "views/learn.html");
};

// learnController.learnPost = (req, res) => {
//     var body = "";
// }

module.exports = learnController;
