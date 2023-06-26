const Utils = require("../utils");
const rss = require("rss");
const User = require("../models/userModel");
const UserScore = require("../models/userScoreModel");
const Lesson = require("../models/lessonModel");

let apiController = {};

apiController.leaderboardGet = async (req, res) => {
  const feed = new rss({
    title: 'Leaderboard RSS Feed',
    description: 'Latest leaderboard rankings',
    feed_url: 'http://localhost:3000/api/leaderboard',
    site_url: 'http://localhost:3000/api/leaderboard',
    managingEditor: 'Razvan Pletosu',
    webMaster: 'Razvan Pletosu',
    language: 'en',
    ttl: 60,
  });

    const users = await User.findAll();
    const userScores = [];

    for (const user of users) {
      const userScore = await UserScore.getUserScore(user._id); 
      userScores.push({ name: user.name, score: userScore });
    }

    userScores.sort((a, b) => b.score - a.score);

    let rank = 0;
    userScores.forEach((entry) => {
      rank = rank + 1;
      const item = {
        title: `${rank}. ${entry.name}`,
        description: `Score: ${entry.score}`,
        url: `http://localhost:3000/api/leaderboard/${rank}`,
        guid: rank.toString(),
      };
      feed.item(item);
    });

    res.setHeader('Content-Type', 'application/rss+xml');
    res.end(feed.xml());
};

apiController.lessonsGet = async (req, res) => {
  const user = await User.findById(req.locals.userId);
  const lessons = await Lesson.findAll();
  const updatedLessons = await Promise.all(lessons.map(async (lesson) => {
    const userScore = await UserScore.getScore(user._id, lesson._id);
    const newLesson = Object.assign({}, lesson, { score: userScore });
    return newLesson;
  }));
  res.end(JSON.stringify(updatedLessons));  
};

apiController.lessonsRecGet = async (req, res) => {
  const user = await User.findById(req.locals.userId);
  const lessons = await Lesson.findLessons(user.occupation);
  const updatedLessons = await Promise.all(lessons.map(async (lesson) => {
    const userScore = await UserScore.getScore(user._id, lesson._id);
    const newLesson = Object.assign({}, lesson, { score: userScore });
    return newLesson;
  }));
  res.end(JSON.stringify(updatedLessons));  
};

apiController.userGet = async (req, res) => {
  const user = await User.findById(req.locals.userId);
  res.end(JSON.stringify(user));
}

apiController.lessonGet = async (req, res) => {
  const lessonURL = req.url.split('/')[3];
  const lesson = await Lesson.findByURLTag(lessonURL);
  res.end(JSON.stringify(lesson));
}

module.exports = apiController;