import * as mongodb from 'mongodb';

class ThingModel {

  private db: mongodb.Db;

  constructor(database: mongodb.Db) {
    this.db = database;
  }

  createForUser(user_id: string, data: any): Promise<mongodb.InsertOneWriteOpResult> {
    return new Promise<mongodb.InsertOneWriteOpResult>((resolve, reject) => {
      this.db.collection('thing', null, (err, collection) => {
        if (err) {
          reject(err);
          return;
        }
        // TODO: sanitize thing
        const thing = {
          user_id,
          name: data.name,
        };
        collection.insertOne(thing, null, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        });
      });
    });
  }

  findAllForUser(user_id: string): Promise<Thing[]> {
    return new Promise<Thing[]>((resolve, reject) => {
      this.db.collection('thing', null, (err, collection) => {
        if (err) {
          reject(err);
          return;
        }
        const things: Thing[] = [];
        const cursor = collection.find({user_id});
        cursor.forEach((thing: Thing) => {
          things.push(thing);
        }, (err: mongodb.MongoError) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(things);
        });
      });
    });
  }

}

function ThingModelFactory(database: mongodb.Db): ThingModel {
  return new ThingModel(database);
}

// Thing document
interface Thing {
  name: string;
}

export {
  ThingModel,
  ThingModelFactory
}
