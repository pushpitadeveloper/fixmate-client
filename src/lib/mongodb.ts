import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

if (!globalThis._mongoClient) {
  globalThis._mongoClient = new MongoClient(uri);
}
client = globalThis._mongoClient;

export const db = client.db("fixmate");
