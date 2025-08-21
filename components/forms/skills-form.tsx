"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X, Zap, Star } from "lucide-react"
import { useState } from "react"

interface SkillsFormProps {
  data: any[]
  onChange: (data: any[]) => void
}

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [newSkillInputs, setNewSkillInputs] = useState<{ [key: number]: string }>({})

  const addSkillCategory = () => {
    onChange([
      ...data,
      {
        category: "",
        skills: [],
      },
    ])
  }

  const removeSkillCategory = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateCategory = (index: number, category: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], category }
    onChange(updated)
  }

  const addSkill = (categoryIndex: number, skill: string) => {
    if (!skill.trim()) return

    const updated = [...data]
    updated[categoryIndex] = {
      ...updated[categoryIndex],
      skills: [...updated[categoryIndex].skills, skill.trim()],
    }
    onChange(updated)

    // Clear the input
    setNewSkillInputs({ ...newSkillInputs, [categoryIndex]: "" })
  }

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...data]
    updated[categoryIndex] = {
      ...updated[categoryIndex],
      skills: updated[categoryIndex].skills.filter((_: any, i: number) => i !== skillIndex),
    }
    onChange(updated)
  }

  const handleKeyPress = (e: React.KeyboardEvent, categoryIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(categoryIndex, newSkillInputs[categoryIndex] || "")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-purple-900">Skills & Expertise</h2>
              <p className="text-purple-700">Showcase your technical and professional abilities</p>
            </div>
          </div>
          <Button onClick={addSkillCategory} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {data.map((skillCategory, index) => (
          <Card
            key={index}
            className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-transparent"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg text-purple-900">
                    {skillCategory.category || `Skill Category ${index + 1}`}
                  </CardTitle>
                </div>
                <Button
                  onClick={() => removeSkillCategory(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-purple-800 font-medium">Category Name</Label>
                <Input
                  value={skillCategory.category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  placeholder="e.g., Programming Languages, Design Tools, Soft Skills"
                  className="border-purple-200 focus:border-purple-400 font-medium"
                />
              </div>

              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <Label className="text-purple-800 font-medium mb-3 block">Add Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkillInputs[index] || ""}
                    onChange={(e) => setNewSkillInputs({ ...newSkillInputs, [index]: e.target.value })}
                    placeholder="Type a skill and press Enter or click Add"
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                  <Button
                    type="button"
                    onClick={() => addSkill(index, newSkillInputs[index] || "")}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {skillCategory.skills.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-purple-800 font-medium flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Your Skills ({skillCategory.skills.length})
                  </Label>
                  <div className="flex flex-wrap gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    {skillCategory.skills.map((skill: string, skillIndex: number) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 hover:bg-purple-200 transition-colors"
                      >
                        <span className="font-medium">{skill}</span>
                        <button
                          onClick={() => removeSkill(index, skillIndex)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {skillCategory.skills.length === 0 && (
                <div className="text-center py-6 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
                  <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-600">No skills added yet</p>
                  <p className="text-sm text-purple-500">Start adding skills to this category</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-purple-300">
          <CardContent className="text-center py-12">
            <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <p className="text-purple-600 mb-2 text-lg">Highlight your expertise</p>
            <p className="text-purple-500 mb-4">Organize your skills into categories for better presentation</p>
            <Button onClick={addSkillCategory} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Skill Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
