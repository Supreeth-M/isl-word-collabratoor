"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Users, Upload, Sparkles, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Word {
  _id: string
  word: string
  collaborators: string[]
}

export default function WordCollaborationApp() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(false) // Changed to false for demo
  const [newWord, setNewWord] = useState("")
  const [csvWords, setCsvWords] = useState("")
  const [collaboratingWord, setCollaboratingWord] = useState<string | null>(null)
  const [collaboratorName, setCollaboratorName] = useState("")
  const [isAddingWord, setIsAddingWord] = useState(false)
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false)

  // Demo data for testing
  useEffect(() => {
    setWords([
      { _id: "1", word: "Hello", collaborators: ["Alice", "Bob"] },
      { _id: "2", word: "World", collaborators: ["Charlie", "Diana", "Eve"] },
      { _id: "3", word: "Collaboration", collaborators: ["Frank"] },
      { _id: "4", word: "Team", collaborators: [] },
    ])
  }, [])

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/words")
      const data = await response.json()
      setWords(data)
    } catch (error) {
      console.error("Error fetching words:", error)
    } finally {
      setLoading(false)
    }
  }

  const addWord = async () => {
    if (!newWord.trim()) return

    setIsAddingWord(true)
    try {
      // For demo, we'll just add it locally
      const newWordObj = {
        _id: Date.now().toString(),
        word: newWord.trim(),
        collaborators: []
      }
      setWords([...words, newWordObj])
      setNewWord("")
    } catch (error) {
      console.error("Error adding word:", error)
    } finally {
      setIsAddingWord(false)
    }
  }

  const addCsvWords = async () => {
    if (!csvWords.trim()) return

    const wordList = csvWords
      .split(",")
      .map((w) => w.trim())
      .filter((w) => w)

    try {
      const newWords = wordList.map(word => ({
        _id: Date.now().toString() + Math.random().toString(),
        word,
        collaborators: []
      }))
      setWords(prev => [...prev, ...newWords])
      setCsvWords("")
      setIsCsvDialogOpen(false)
    } catch (error) {
      console.error("Error adding CSV words:", error)
    }
  }

  const addCollaborator = async (wordId: string) => {
    if (!collaboratorName.trim()) return

    try {
      setWords(words.map((w) => 
        w._id === wordId 
          ? { ...w, collaborators: [...(w.collaborators || []), collaboratorName.trim()] }
          : w
      ))
      setCollaboratorName("")
      setCollaboratingWord(null)
    } catch (error) {
      console.error("Error adding collaborator:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action()
    }
  }

  const getRandomCardColor = (index: number) => {
    const colors = [
      "bg-gradient-to-br from-blue-400/20 to-blue-600/30 border-blue-200/50",
      "bg-gradient-to-br from-red-400/20 to-red-600/30 border-red-200/50",
      "bg-gradient-to-br from-slate-400/20 to-slate-600/30 border-slate-200/50",
      "bg-gradient-to-br from-purple-400/20 to-purple-600/30 border-purple-200/50",
      "bg-gradient-to-br from-pink-400/20 to-pink-600/30 border-pink-200/50",
      "bg-gradient-to-br from-cyan-400/20 to-cyan-600/30 border-cyan-200/50",
    ]
    return colors[index % colors.length]
  }

  const getRandomBadgeColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-300",
      "bg-red-100 text-red-800 border-red-300",
      "bg-slate-100 text-slate-800 border-slate-300",
      "bg-purple-100 text-purple-800 border-purple-300",
      "bg-pink-100 text-pink-800 border-pink-300",
      "bg-cyan-100 text-cyan-800 border-cyan-300",
    ]
    return colors[index % colors.length]
  }

  // Helper function to safely get collaborator count
  const getCollaboratorCount = () => {
    return words.reduce((acc, word) => acc + (word.collaborators?.length || 0), 0)
  }

  // Helper function to get active collaborations count
  const getActiveCollaborationsCount = () => {
    return words.filter((word) => Array.isArray(word.collaborators) && word.collaborators.length > 0).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-red-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(148,163,184,0.1),transparent_50%)]"></div>

        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-blue-500 via-red-500 to-slate-500 mx-auto mb-6"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div className="absolute inset-3 animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-slate-500 via-blue-500 to-red-500"></div>
          </div>
          <p className="text-slate-700 text-lg font-medium">Loading magical words...</p>
          <div className="flex justify-center gap-1 mt-2">
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
            <Heart className="h-4 w-4 text-red-500 animate-pulse delay-100" />
            <Star className="h-4 w-4 text-slate-500 animate-pulse delay-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-red-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(148,163,184,0.1),transparent_50%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-red-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-slate-200/30 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-blue-500 animate-bounce" />
            <Heart className="h-6 w-6 text-red-500 animate-pulse" />
            <Star className="h-7 w-7 text-slate-500 animate-spin" />
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-blue-600 via-red-500 to-slate-600 bg-clip-text text-transparent">
              ISL Word Collaboration Hub
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-red-500/20 to-slate-600/20 blur-lg -z-10"></div>
          </h1>

          <p className="text-slate-700 text-lg max-w-2xl mx-auto leading-relaxed">
            ✨ Create, share, and collaborate on words with your team. Click any word to add collaborators and build
            something amazing together! 🚀
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <div className="flex gap-2">
            <Input
              placeholder="✨ Add a magical word..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addWord)}
              className="w-64 border-2 border-blue-200/50 focus:border-blue-400 bg-white/80 backdrop-blur-sm shadow-lg"
            />
            <Button
              onClick={addWord}
              disabled={isAddingWord || !newWord.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {isAddingWord ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Dialog open={isCsvDialogOpen} onOpenChange={setIsCsvDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-2 border-red-200/50 hover:border-red-400 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-red-600 hover:text-red-700"
              >
                <Upload className="h-4 w-4" />🎯 Add CSV Words
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm border-2 border-slate-200/50">
              <DialogHeader>
                <DialogTitle className="text-slate-800 text-xl">🎨 Add Multiple Words</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-input" className="text-slate-700 font-medium">
                    Enter words separated by commas
                  </Label>
                  <Textarea
                    id="csv-input"
                    placeholder="hello, world, collaboration, team, project, amazing, creative, inspire..."
                    value={csvWords}
                    onChange={(e) => setCsvWords(e.target.value)}
                    className="mt-2 border-2 border-slate-200/50 focus:border-slate-400 bg-white/80"
                  />
                </div>
                <Button
                  onClick={addCsvWords}
                  className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 shadow-lg"
                >
                  ✨ Add Words
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-400/20 to-blue-600/30 backdrop-blur-sm border-2 border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-2">{words.length}</div>
              <div className="text-blue-600 font-medium">📚 Total Words</div>
              <Sparkles className="h-5 w-5 text-blue-500 mx-auto mt-2 animate-pulse" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-400/20 to-red-600/30 backdrop-blur-sm border-2 border-red-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-700 mb-2">{getCollaboratorCount()}</div>
              <div className="text-red-600 font-medium">👥 Total Collaborators</div>
              <Heart className="h-5 w-5 text-red-500 mx-auto mt-2 animate-pulse" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-400/20 to-slate-600/30 backdrop-blur-sm border-2 border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-slate-700 mb-2">{getActiveCollaborationsCount()}</div>
              <div className="text-slate-600 font-medium">🎯 Active Collaborations</div>
              <Star className="h-5 w-5 text-slate-500 mx-auto mt-2 animate-pulse" />
            </CardContent>
          </Card>
        </div>

        {/* Words Grid */}
        {words.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold text-slate-700 mb-4">No words yet - Let's create magic! ✨</h3>
            <p className="text-slate-600 text-lg">Add your first word to get started with collaboration! 🚀</p>
            <div className="flex justify-center gap-2 mt-4">
              <Sparkles className="h-5 w-5 text-blue-500 animate-bounce" />
              <Heart className="h-5 w-5 text-red-500 animate-bounce delay-100" />
              <Star className="h-5 w-5 text-slate-500 animate-bounce delay-200" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {words.map((word, index) => (
              <Card
                key={word._id}
                className={`group hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-sm border-2 shadow-xl hover:scale-110 hover:rotate-1 ${getRandomCardColor(index)}`}
                onClick={() => setCollaboratingWord(word._id)}
              >
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 opacity-20">
                    {index % 3 === 0 && <Sparkles className="h-4 w-4 text-blue-500" />}
                    {index % 3 === 1 && <Heart className="h-4 w-4 text-red-500" />}
                    {index % 3 === 2 && <Star className="h-4 w-4 text-slate-500" />}
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-800 mb-4 break-words group-hover:text-slate-900 transition-colors">
                      {word.word}
                    </div>

                    {Array.isArray(word.collaborators) && word.collaborators.length > 0 && (
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-center gap-1 text-sm text-slate-600 font-medium">
                          <Users className="h-3 w-3" />
                          <span className="text-blue-600 font-semibold">{word.collaborators.length}</span> Collaborators
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {word.collaborators.map((collaborator, collabIndex) => (
                            <Badge
                              key={`${word._id}-collaborator-${collabIndex}`}
                              variant="secondary"
                              className={`text-xs border font-medium hover:scale-105 transition-transform ${getRandomBadgeColor(collabIndex)}`}
                            >
                              {collaborator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-red-500 group-hover:text-white transition-all duration-300 border-2 border-slate-300 hover:border-transparent shadow-md hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCollaboratingWord(word._id)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />✨ Collaborate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Collaboration Modal */}
        {collaboratingWord && (
          <Dialog open={!!collaboratingWord} onOpenChange={() => setCollaboratingWord(null)}>
            <DialogContent className="bg-white/95 backdrop-blur-sm border-2 border-slate-200/50 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 text-xl">
                  ✨ Add Collaborator to "{words.find((w) => w._id === collaboratingWord)?.word}" 🎯
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="collaborator-name" className="text-slate-700 font-medium">
                    Your Amazing Name
                  </Label>
                  <Input
                    id="collaborator-name"
                    placeholder="🌟 Enter your name..."
                    value={collaboratorName}
                    onChange={(e) => setCollaboratorName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => addCollaborator(collaboratingWord))}
                    className="mt-2 border-2 border-slate-200/50 focus:border-blue-400 bg-white/80"
                  />
                </div>
                <Button
                  onClick={() => addCollaborator(collaboratingWord)}
                  className="w-full bg-gradient-to-r from-blue-500 via-red-500 to-slate-500 hover:from-blue-600 hover:via-red-600 hover:to-slate-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!collaboratorName.trim()}
                >
                  🚀 Add Collaborator
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}