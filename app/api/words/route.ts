import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const words = await db.collection("words").find({}).toArray()
    return NextResponse.json(words)
  } catch (error) {
    console.error("Error fetching words:", error)
    return NextResponse.json({ error: "Failed to fetch words" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()

    if (!word || !word.trim()) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if word already exists
    const existingWord = await db.collection("words").findOne({ word: word.trim() })
    if (existingWord) {
      return NextResponse.json({ error: "Word already exists" }, { status: 400 })
    }

    const newWord = {
      word: word.trim(),
      collaborators: [],
      createdAt: new Date(),
    }

    const result = await db.collection("words").insertOne(newWord)
    const insertedWord = await db.collection("words").findOne({ _id: result.insertedId })

    return NextResponse.json(insertedWord)
  } catch (error) {
    console.error("Error adding word:", error)
    return NextResponse.json({ error: "Failed to add word" }, { status: 500 })
  }
}
