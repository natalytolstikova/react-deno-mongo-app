import { MongoClient, ServerApiVersion } from "npm:mongodb@6.1.0";
import "jsr:@std/dotenv/load";

const uri = Deno.env.get("SANDBOX_MONGO_URI");
const DB_NAME = Deno.env.get("DB_NAME") || "todo_db";

if (!uri) {
  console.error("MONGODB_URI is not set");
  Deno.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  Deno.exit(1);
}

const db = client.db(DB_NAME);
const categories = db.collection("categories");
const products = db.collection("products");

export { db, categories, products };
