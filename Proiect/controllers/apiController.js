const rss = require("rss");
const User = require("../models/userModel");
const UserScore = require("../models/userScoreModel");

let apiController = {};

const leaderboard = [
    { rank: 1, name: 'John Doe', score: 100 },
    { rank: 2, name: 'Jane Smith', score: 90 },
    { rank: 3, name: 'Alice Johnson', score: 85 },
    // Add more entries as needed
  ];

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

module.exports = apiController;