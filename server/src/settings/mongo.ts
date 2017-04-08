const mongo = {
  db: process.env.MONGO_DB || 'local',
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || '27017'
};

const settings = {
  db: mongo.db,
  host: mongo.host,
  port: mongo.port,
  url: `mongodb://${mongo.host}:${mongo.port}/${mongo.db}`
};

export { settings }
