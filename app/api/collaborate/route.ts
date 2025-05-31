import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { wordId, name } = await request.json()

    if (!wordId || !name || !name.trim()) {
      return NextResponse.json({ error: "Word ID and name are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find the word and check if collaborator already exists
    const word = await db.collection("words").findOne({ _id: new ObjectId(wordId) })
    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 })
    }

    if (word.collaborators.includes(name.trim())) {
      return NextResponse.json({ error: "Collaborator already exists" }, { status: 400 })
    }

    // Add collaborator
    const result = await db
      .collection("words")
      .findOneAndUpdate(
        { _id: new ObjectId(wordId) },
        { $push: { collaborators: name.trim() } },
        { returnDocument: "after" },
      )

    if (!result || !result.value) {
      return NextResponse.json({ error: "Failed to add collaborator" }, { status: 500 })
    }
    return NextResponse.json(result.value)
  } catch (error) {
    console.error("Error adding collaborator:", error)
    return NextResponse.json({ error: "Failed to add collaborator" }, { status: 500 })
  }
}
