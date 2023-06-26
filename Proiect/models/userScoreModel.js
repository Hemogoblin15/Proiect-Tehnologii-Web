const getDb = require('../database').getDb

class UserScore {
    constructor (userId, lessonId, score) {
        this.userId = userId;
        this.lessonId = lessonId;
        this.score = score;
    }

    save() {
        const db = getDb();
        return db.collection("userScores").insertOne(this);
    }

    static async findScore(userId, lessonId) {
        const db = getDb();
        const collection = db.collection("userScores");
        const userScore = await collection.findOne({ userId, lessonId });
        return userScore;
    }

    static async updateScore(scoreId, newScore) {
        const db = getDb();
        await db.collection("userScores").updateOne({ _id : scoreId }, { $set : { score : newScore}});
    }
}

module.exports = UserScore;