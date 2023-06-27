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

    static async getScore(userId, lessonId) {
        let score = 0;
        const db = getDb();
        const collection = db.collection("userScores");
        const userScore = await collection.findOne({ userId, lessonId });
        if (userScore) {
        score = score + userScore.score;
        return score;
        }
    }

    static async updateScore(scoreId, newScore) {
        const db = getDb();
        await db.collection("userScores").updateOne({ _id : scoreId }, { $set : { score : newScore}});
    }

    static async getUserScore(userId) {
        const db = getDb();
        let score = 0;
        const userScores = await db.collection("userScores").find( {userId} ).toArray();
        userScores.forEach((userScore) => {
            score += userScore.score;
        });
        return score;
    }

    static remove(lessonId) {
        const db = getDb()
        db.collection('userScores').deleteMany({ lessonId });
    }
}

module.exports = UserScore;