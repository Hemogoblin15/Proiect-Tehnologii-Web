const getDb = require("../database").getDb;
const mongodb = require('mongodb')

class Lesson {
  constructor(
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
    A5c,
  ) {
    this.urlTag = urlTag;
    this.title = title;
    this.description = description;
    this.text = text;
    this.tags = tags;
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

  static async findLessons(tags){
    const db = getDb();
    const collection = db.collection('lessons')
    const lessons = await collection.find({ tags }).toArray();
    return lessons;
  }

  static async editLesson(
    id,
    urlTagn,
    titlen,
    descriptionn,
    textn,
    tagsn,
    Q1n,
    A11n,
    A12n,
    A13n,
    A1cn,
    Q2n,
    A21n,
    A22n,
    A23n,
    A2cn,
    Q3n,
    A31n,
    A32n,
    A33n,
    A3cn,
    Q4n,
    A41n,
    A42n,
    A43n,
    A4cn,
    Q5n,
    A51n,
    A52n,
    A53n,
    A5cn){
      const db = getDb();
      db.collection("lessons").updateOne({ _id : id }, { $set : { urlTag : urlTagn } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { title : titlen} } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { description : descriptionn} } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { text : textn} } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { tags : tagsn} } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { Q1 : Q1n} } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A11 : A11n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A12 : A12n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A13 : A13n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A1c : A1cn } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { Q2 : Q2n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A21 : A21n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A22 : A22n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A23 : A23n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A2c : A2cn } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { Q3 : Q3n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A31 : A31n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A32 : A32n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A33 : A33n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A3c : A3cn } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { Q4 : Q4n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A41 : A41n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A42 : A42n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A43 : A43n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A4c : A4cn } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { Q5 : Q5n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A51 : A51n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A52 : A52n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A53 : A53n } } );
      db.collection("lessons").updateOne({ _id : id }, { $set : { A5c : A5cn } } );
    }

  static remove(urlTag) {
    const db = getDb();
    db.collection("lessons").deleteOne({ urlTag });
  }
}

module.exports = Lesson;
