import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

if (!(globalThis as any)._mongoClient) {
  (globalThis as any)._mongoClient = new MongoClient(uri);
}
client = (globalThis as any)._mongoClient;

export const db = client.db("fixmate");
