const fs = require("fs");
const Utils = require("../utils");
const User = require("../models/userModel");
const Lesson = require("../models/lessonModel")
const lessonComponent = require("../views/components/lessonComponent");

let profileController = {};

profileController.profileGet = async (req, res) => {
  let user = await User.findById(req.locals.userId);
  let lessons = await Lesson.findLessons(user.occupation);
  lessons = lessons?.map((lesson) =>
    lessonComponent
    .replace("{{title}}", parseDbData(lesson.title))
    .replace("{{description}}", parseDbData(lesson.description))
    .replace("{{urlTag}}", lesson.urlTag)
    );
  fs.readFile("./views/profile.html", "utf8", (err, data) => {
    if (user === null) {
      console.error("Error reading profile.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else {
      let profilePage = data
        .replace("{{name}}", user.name)
        .replace("{{country}}", user.country)
        .replace("{{occupation}}", user.occupation)
        .replace("{{each-lesson}}",
      lessons?.reduce((acc, lesson) => acc + lesson, "")
      );
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(profilePage);
    }
  });
};

function parseDbData(dbData) {
  let data = "";
  const dbFields = dbData.split("+");

  for (let i = 0; i < dbFields.length; i++) {
    data = data + dbFields[i] + " ";
  }

  return data;
} 

module.exports = profileController;
