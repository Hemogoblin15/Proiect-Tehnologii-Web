const Utils = require("../utils");
const fs = require("fs");
const User = require("../models/userModel");
const Lesson = require("../models/lessonModel");
//const { setLessonNumber } = require("../lessonSelector");
let learnController = {};

learnController.learnGet = async (req, res) => {
  let user = await User.findById(req.locals.userId);
  fs.readFile("./views/learn.html", "utf8", (err, data) => {
    if (user === null) {
      console.error("Error reading learn.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else if (user.admin) {
      let learnPage = data.replace(
        "{{addButton}}",
        `
        <script>
        function redirectToAdd() {
            window.location.href = "/learn/add";
        }
        </script>
        <button onclick="redirectToAdd()">
        <span> Add lesson
        </span>
        </button>`
      );
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(learnPage);
    } else {
      let learnPage = data.replace("{{addButton}}", "");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(learnPage);
    }
  });
};

learnController.lessonAddGet = async (req, res) => {
  Utils.sendResources(req, res, "views/add.html");
};

learnController.lessonGet = async (req, res) => {
  let lesson = req.url.split("/")[2];
  Utils.sendResources(req, res, "views/lessons/" + lesson + ".html");
};

learnController.lessonAddPost = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    console.log(body);
  });
  req.on("end", async () => {
    const {
      title,
      text,
      urlTag,
      tags,
      Q1,
      A11,
      A12,
      A13,
      A1c,
      Q2,
      A21,
      A22,
      A23,
      A2c,
      Q3,
      A31,
      A32,
      A33,
      A3c,
      Q4,
      A41,
      A42,
      A43,
      A4c,
      Q5,
      A51,
      A52,
      A53,
      A5c,
    } = parseFormData(body);
    const findLesson = await Lesson.findByURLTag(urlTag);
    if (findLesson) {
      res.statusCode = 401;
      res.end("A lesson using this title already exists");
    } else {
      const lesson = new Lesson(
        urlTag,
        title,
        text,
        tags,
        Q1,
        A11,
        A12,
        A13,
        A1c,
        Q2,
        A21,
        A22,
        A23,
        A2c,
        Q3,
        A31,
        A32,
        A33,
        A3c,
        Q4,
        A41,
        A42,
        A43,
        A4c,
        Q5,
        A51,
        A52,
        A53,
        A5c
      );
      lesson.save();
      res.statusCode = 302;
      Utils.redirectTo("/learn", res);
      res.end();
    }
  });
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

module.exports = learnController;
