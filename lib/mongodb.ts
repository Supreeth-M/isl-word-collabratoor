import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || "word-collaboration"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

interface MongoConnection {
  client: MongoClient
  db: Db
}

let cachedConnection: MongoConnection | null = null

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    const client = new MongoClient(MONGODB_URI!)
    await client.connect()

    const db = client.db(MONGODB_DB)

    cachedConnection = { client, db }

    console.log("Connected to MongoDB Atlas")
    return cachedConnection
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    throw error
  }
}
