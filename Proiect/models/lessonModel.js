const getDb = require("../database").getDb;

class Lesson {
  constructor(lessonText, lessonNumber) {
    this.lessonText = lessonText;
    this.lessonNumber = lessonNumber;
  }

  save() {
    const db = getDb();
    return db.collection("lessons").insertOne(this);
  }

  static findAll() {
    const db = getDb();
    return db.collection("lessons").find().toArray();
  }

  static findByNumber(lessonNumber) {
    const db = getDb();
    const collection = db.collection("lessons");
    const lesson = collection.findOne({ lessonNumber });
    return lesson;
  }

  static remove(lessonNumber) {
    const db = getDb();
    db.collection("lessons").deleteOne({ lessonNumber });
  }
}

module.exports = Lesson;
