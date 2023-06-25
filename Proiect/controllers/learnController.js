const Utils = require("../utils");
const fs = require("fs");
const User = require("../models/userModel");
const Lesson = require("../models/lessonModel");
const lessonComponent = require("../views/components/lessonComponent");

let learnController = {};

learnController.learnGet = async (req, res) => {
  let user = await User.findById(req.locals.userId);
  let lessons = await Lesson.findAll();
  lessons = lessons?.map((lesson) =>
    lessonComponent
      .replace("{{title}}", parseDbData(lesson.title))
      .replace("{{description}}", parseDbData(lesson.description))
      .replace("{{urlTag}}", lesson.urlTag)
  );
  fs.readFile("./views/learn.html", "utf8", (err, data) => {
    if (user === null) {
      console.error("Error reading learn.html", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    } else if (user.admin) {
      let learnPage = data
        .replace(
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
        )
        .replace(
          "{{each-lesson}}",
          lessons?.reduce((acc, lesson) => acc + lesson, "")
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
  const lessonURL = req.url.split("/")[2];
  const lesson = await Lesson.findByURLTag(lessonURL);
  if (!lesson) {
    res.statusCode = 401;
    res.end("A lesson with this title does not exist");
  } else {
    fs.readFile("./views/lesson.html", "utf8", (err, data) => {
      let lessonPage = data
        .replace("{{name}}", parseDbData(lesson.title))
        .replace("{{title}}", parseDbData(lesson.title))
        .replace("{{text}}", parseDbData(lesson.text))
        .replace("{{Q1}}", parseDbData(lesson.Q1))
        .replace("{{A11}}", parseDbData(lesson.A11))
        .replace("{{A12}}", parseDbData(lesson.A12))
        .replace("{{A13}}", parseDbData(lesson.A13))
        .replace("{{Q2}}", parseDbData(lesson.Q2))
        .replace("{{A21}}", parseDbData(lesson.A21))
        .replace("{{A22}}", parseDbData(lesson.A22))
        .replace("{{A23}}", parseDbData(lesson.A23))
        .replace("{{Q3}}", parseDbData(lesson.Q3))
        .replace("{{A31}}", parseDbData(lesson.A31))
        .replace("{{A32}}", parseDbData(lesson.A32))
        .replace("{{A33}}", parseDbData(lesson.A33))
        .replace("{{Q4}}", parseDbData(lesson.Q4))
        .replace("{{A41}}", parseDbData(lesson.A41))
        .replace("{{A42}}", parseDbData(lesson.A42))
        .replace("{{A43}}", parseDbData(lesson.A43))
        .replace("{{Q5}}", parseDbData(lesson.Q5))
        .replace("{{A51}}", parseDbData(lesson.A51))
        .replace("{{A52}}", parseDbData(lesson.A52))
        .replace("{{A53}}", parseDbData(lesson.A53));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(lessonPage);
    });
  }
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
      description,
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
    console.log("\n\n %s", Q1);
    const findLesson = await Lesson.findByURLTag(urlTag);
    if (findLesson) {
      res.statusCode = 401;
      res.end("A lesson using this title already exists");
    } else {
      const lesson = new Lesson(
        urlTag,
        title,
        description,
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

learnController.lessonEditGet = async (req, res) => {
  const lessonURL = req.url.split("/")[2];
  const lesson = await Lesson.findByURLTag(lessonURL);
  fs.readFile("./views/edit.html", "utf8", (err, data) => {
    let editPage = data
      .replace("{{title}}", parseDbData(lesson.title))
      .replace("{{text}}", parseDbData(lesson.text))
      .replace("{{urlTag}}", parseDbData(lesson.urlTag))
      .replace("{{description}}", parseDbData(lesson.description))
      .replace("{{tags}}", parseDbData(lesson.tags))
      .replace("{{Q1}}", parseDbData(lesson.Q1))
      .replace("{{A11}}", parseDbData(lesson.A11))
      .replace("{{A12}}", parseDbData(lesson.A12))
      .replace("{{A13}}", parseDbData(lesson.A13))
      .replace("{{Q2}}", parseDbData(lesson.Q2))
      .replace("{{A21}}", parseDbData(lesson.A21))
      .replace("{{A22}}", parseDbData(lesson.A22))
      .replace("{{A23}}", parseDbData(lesson.A23))
      .replace("{{Q3}}", parseDbData(lesson.Q3))
      .replace("{{A31}}", parseDbData(lesson.A31))
      .replace("{{A32}}", parseDbData(lesson.A32))
      .replace("{{A33}}", parseDbData(lesson.A33))
      .replace("{{Q4}}", parseDbData(lesson.Q4))
      .replace("{{A41}}", parseDbData(lesson.A41))
      .replace("{{A42}}", parseDbData(lesson.A42))
      .replace("{{A43}}", parseDbData(lesson.A43))
      .replace("{{Q5}}", parseDbData(lesson.Q5))
      .replace("{{A51}}", parseDbData(lesson.A51))
      .replace("{{A52}}", parseDbData(lesson.A52))
      .replace("{{A53}}", parseDbData(lesson.A53));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(editPage);
  });
};

learnController.lessonEditPost = (req, res) => {
  const lessonURL = req.url.split("/")[2];
  Lesson.remove(lessonURL);
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    console.log(body);
  });
  req.on("end", async () => {
    const {
      title,
      description,
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
    console.log("\n\n %s", Q1);
    const findLesson = await Lesson.findByURLTag(urlTag);
    if (findLesson) {
      res.statusCode = 401;
      res.end("A lesson using this title already exists");
    } else {
      const lesson = new Lesson(
        urlTag,
        title,
        description,
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
      Utils.redirectTo("/learn/" + findLesson.urlTag, res);
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

function parseDbData(dbData) {
  let data = "";
  const dbFields = dbData.split("+");

  for (let i = 0; i < dbFields.length; i++) {
    data = data + dbFields[i] + " ";
  }

  return data;
}

module.exports = learnController;
