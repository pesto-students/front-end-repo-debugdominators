import { MongoClient } from "mongodb";

const globalWithMongo = global as typeof globalThis & {
  _mongomongoClientPromise: Promise<MongoClient>;
};

if (!process.env.MONGO_URI) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_CONNECTION_STRING"',
  );
}

const uri = process.env.MONGO_URI;
const options = {};

let client: MongoClient;
let mongoClientPromise: Promise<MongoClient>;

if (process.env.ENVIRONMENT === "development") {
  if (!globalWithMongo._mongomongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongomongoClientPromise = client.connect();
  }
  mongoClientPromise = globalWithMongo._mongomongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  mongoClientPromise = client.connect();
}

export default mongoClientPromise;
