import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI missing");

let client: MongoClient;

declare global {
  // Allow global._mongoClientPromise for hot-reload
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise as Promise<MongoClient>;

export async function getDb() {
  const c = await clientPromise;
  return c.db(); // default DB from URI
}
