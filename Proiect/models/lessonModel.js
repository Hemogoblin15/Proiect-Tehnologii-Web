const getDb = require("../database").getDb;
const mongodb = require('mongodb')

class Lesson {
  constructor(
    urlTag,
    Title,
    Text,
    Tags,
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
  ) {
    this.urlTag = urlTag;
    this.Title = Title;
    this.Text = Text;
    this.Tags = Tags;
    this.Q1 = Q1;
    this.A11 = A11;
    this.A12 = A12;
    this.A13 = A13;
    this.A1c = A1c;
    this.Q2 = Q2;
    this.A21 = A21;
    this.A22 = A22;
    this.A23 = A23;
    this.A2c = A2c;
    this.Q3 = Q3;
    this.A31 = A31;
    this.A32 = A32;
    this.A33 = A33;
    this.A3c = A3c;
    this.Q4 = Q4;
    this.A41 = A41;
    this.A42 = A42;
    this.A43 = A43;
    this.A4c = A4c;
    this.Q5 = Q5;
    this.A51 = A51;
    this.A52 = A52;
    this.A53 = A53;
    this.A5c = A5c;
  }

  save() {
    const db = getDb();
    return db.collection("lessons").insertOne(this);
  }

  static findAll() {
    const db = getDb();
    return db.collection("lessons").find().toArray();
  }

  static async findByURLTag(urlTag) {
    const db = getDb();
    const collection = db.collection('lessons');
    const lesson = await collection.findOne({ urlTag });
    return lesson;
  }

  static remove(urlTag) {
    const db = getDb();
    db.collection("lessons").deleteOne({ urlTag });
  }
}

module.exports = Lesson;
