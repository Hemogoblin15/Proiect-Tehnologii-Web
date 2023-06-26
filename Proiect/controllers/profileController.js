const fs = require("fs");
const Utils = require("../utils");
const User = require("../models/userModel");
const Lesson = require("../models/lessonModel")
const UserScore = require("../models/userScoreModel")
const lessonComponent = require("../views/components/lessonComponent");

let profileController = {};

profileController.profileGet = async (req, res) => {
  try {
    let user = await User.findById(req.locals.userId);
    let lessons = await Lesson.findLessons(user.occupation);
    lessons = await Promise.all(lessons?.map(async (lesson) => {
      const userScore = await UserScore.findScore(user._id, lesson._id);
      console.log(user._id, lesson._id, userScore);
      if(userScore) {
      return lessonComponent
        .replace("{{title}}", parseDbData(lesson.title))
        .replace("{{description}}", parseDbData(lesson.description))
        .replace("{{urlTag}}", lesson.urlTag)
        .replace("{{score}}", "Your score for this lesson: " + userScore.score);
      } else {
      return lessonComponent
        .replace("{{title}}", parseDbData(lesson.title))
        .replace("{{description}}", parseDbData(lesson.description))
        .replace("{{urlTag}}", lesson.urlTag)
        .replace("{{score}}", "");
      }
    }));

    fs.readFile("./views/profile.html", "utf8", (err, data) => {
      if (err) {
        console.error("Error reading profile.html", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        let profilePage = data
          .replace("{{name}}", user.name)
          .replace("{{country}}", user.country)
          .replace("{{occupation}}", user.occupation)
          .replace("{{each-lesson}}", lessons?.reduce((acc, lesson) => acc + lesson, ""));
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(profilePage);
      }
    });
  } catch (error) {
    console.error("Error retrieving user or lessons", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
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
