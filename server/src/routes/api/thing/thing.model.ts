import * as mongodb from 'mongodb';
import * as mongo from '../../../services/mongo';

class ThingModel {

  createForUser(user_id: string, data: any): Promise<mongodb.InsertOneWriteOpResult> {
    return new Promise<mongodb.InsertOneWriteOpResult>((resolve, reject) => {
      mongo.getDatabase().collection('thing', null, (err, collection) => {
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
      mongo.getDatabase().collection('thing', null, (err, collection) => {
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

function ThingModelFactory(): ThingModel {
  return new ThingModel();
}

// Thing document
interface Thing {
  name: string;
}

export {
  ThingModel,
  ThingModelFactory
}
