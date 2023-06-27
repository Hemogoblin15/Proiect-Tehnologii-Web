const Utils = require("../utils");
const fs = require("fs");
const User = require("../models/userModel");
const Lesson = require("../models/lessonModel");
const UserScore = require("../models/userScoreModel");

let learnController = {};

learnController.lessonPost = async (req, res) => {
  const user = await User.findById(req.locals.userId);
  const lessonURL = req.url.split("/")[2];
  const lesson = await Lesson.findByURLTag(lessonURL);
  let score = 0;
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const { Q1, Q2, Q3, Q4, Q5 } = parseFormData(body);
    if (Q1 == lesson.A1c)
      score = score + 1;
    if (Q2 == lesson.A2c)
      score = score + 1;
    if (Q3 == lesson.A3c)
      score = score + 1;
    if (Q4 == lesson.A4c)
      score = score + 1;
    if (Q5 == lesson.A5c)
      score = score + 1;

    const findUserScore = await UserScore.findScore(user._id, lesson._id);

    if (findUserScore) {
      if (score > findUserScore.score)
        UserScore.updateScore(findUserScore._id, score);

      const alertMessage = `Your score: ${score}`;
      const script = `<script>alert("${alertMessage}"); window.location.href = "/learn";</script>`;
      res.setHeader("Content-Type", "text/html");
      res.end(script);
    } else {
      const userScore = new UserScore(user._id, lesson._id, score);
      userScore.save();

      const alertMessage = `Your score: ${score}`;
      const script = `<script>alert("${alertMessage}"); window.location.href = "/learn";</script>`;
      res.setHeader("Content-Type", "text/html");
      res.end(script);
    }
  });
};


learnController.learnGet = async (req, res) => {
 Utils.sendResources(req, res, "views/learn.html");
};

learnController.lessonAddGet = async (req, res) => {
  Utils.sendResources(req, res, "views/add.html");
};

learnController.lessonGet = async (req, res) => {
  let user = await User.findById(req.locals.userId);
  const lessonURL = req.url.split("/")[2];
  const lesson = await Lesson.findByURLTag(lessonURL);
  if (!lesson) {
    res.statusCode = 401;
    res.end("A lesson with this title does not exist");
  } else if (!user.admin) {
    fs.readFile("./views/lesson.html", "utf8", (err, data) => {
      let lessonPage = data
        .replace("{{name}}", parseDbData(lesson.title))
        .replace("{{title}}", parseDbData(lesson.title))
        .replace("{{text}}", parseDbData(lesson.text))
        .replace("{{urlTag}}" , parseDbData(lesson.urlTag))
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
        .replace("{{A53}}", parseDbData(lesson.A53))
        .replace("{{edit-button", "")
        .replace("{{delete-button", "");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(lessonPage);
    });
  } else {
    fs.readFile("./views/lesson.html", "utf8", (err, data) => {
      let lessonPage = data
        .replace("{{name}}", parseDbData(lesson.title))
        .replace("{{title}}", parseDbData(lesson.title))
        .replace("{{text}}", parseDbData(lesson.text))
        .replace("{{urlTag}}" , parseDbData(lesson.urlTag))
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
        .replace("{{A53}}", parseDbData(lesson.A53))
        .replace(
          "{{edit-button}}",
          `
        <div class="edit-button">
        <script>
        function redirectToEdit() {
            window.location.href = "/learn/{{urlTag}}/edit";
        }
        </script>
        <button onclick="redirectToEdit()">
        <span> Edit lesson
        </span>
        </button>
        </div>
        `
        )
        .replace("{{urlTag}}", parseDbData(lesson.urlTag))
        .replace(
          "{{delete-button}}",
          `
        <div class="delete-button">
          <script>
          function showAlert(){
            var result = window.confirm("Are you sure you want to delete the lesson?");
            if(result) {
              window.location.href = "{{urlTag}}/delete";
            } else {
              window.location.href = "{{urlTag}}";
            }
          }
        </script>
        <button onclick="showAlert()">
        <span> Delete lesson
        </span>
        </button>
        </div>`
        )
        .replace("{{urlTag}}", parseDbData(lesson.urlTag))
        .replace("{{urlTag}}", parseDbData(lesson.urlTag));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(lessonPage);
    });
  }
};

learnController.lessonDeleteGet = async (req, res) => {
  const lessonURL = req.url.split("/")[2];
  const lesson = await Lesson.findByURLTag(lessonURL);
  console.log(lesson._id);
  UserScore.remove(lesson._id);
  Lesson.remove(lessonURL);
  res.statusCode = 302;
  Utils.redirectTo("/learn", res);
  res.end();
};

learnController.lessonAddPost = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
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
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
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
    const findLesson = await Lesson.findByURLTag(lessonURL);
    console.log(findLesson._id);
    await Lesson.editLesson(
      findLesson._id,
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
    res.statusCode = 302;
    Utils.redirectTo("/learn/" + parseDbData(urlTag), res);
    res.end();
  });
};

function parseFormData(formData) {
  const data = {};
  const formFields = formData.split("&");

  for (let i = 0; i < formFields.length; i++) {
    const [key, value] = formFields[i].split("=");
    data[key] = parseDbData(decodeURIComponent(value));
  }

  return data;
}

function parseDbData(dbData) {
  let data = "";
  const dbFields = dbData.split("+");

  for (let i = 0; i < dbFields.length - 1; i++) {
    data = data + dbFields[i] + " ";
  }
  data = data + dbFields[dbFields.length - 1];

  return data;
}


module.exports = learnController;