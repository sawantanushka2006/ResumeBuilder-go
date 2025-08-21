"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X, Rocket, ExternalLink, Github, Code } from "lucide-react"
import { useState } from "react"

interface ProjectsFormProps {
  data: any[]
  onChange: (data: any[]) => void
}

export default function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const [newTechInputs, setNewTechInputs] = useState<{ [key: number]: string }>({})

  const addProject = () => {
    onChange([
      ...data,
      {
        name: "",
        description: "",
        technologies: [],
        start_date: "",
        end_date: "",
        is_ongoing: false,
        url: "",
        github_url: "",
      },
    ])
  }

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateProject = (index: number, field: string, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const addTechnology = (projectIndex: number, tech: string) => {
    if (!tech.trim()) return

    const updated = [...data]
    updated[projectIndex] = {
      ...updated[projectIndex],
      technologies: [...updated[projectIndex].technologies, tech.trim()],
    }
    onChange(updated)

    // Clear the input
    setNewTechInputs({ ...newTechInputs, [projectIndex]: "" })
  }

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updated = [...data]
    updated[projectIndex] = {
      ...updated[projectIndex],
      technologies: updated[projectIndex].technologies.filter((_: any, i: number) => i !== techIndex),
    }
    onChange(updated)
  }

  const handleKeyPress = (e: React.KeyboardEvent, projectIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechnology(projectIndex, newTechInputs[projectIndex] || "")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <Rocket className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-orange-900">Project Portfolio</h2>
              <p className="text-orange-700">Showcase your creative work and technical projects</p>
            </div>
          </div>
          <Button onClick={addProject} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {data.map((project, index) => (
          <Card
            key={index}
            className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-50/30 to-transparent"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Rocket className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-orange-900">{project.name || `Project ${index + 1}`}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      {project.url && (
                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live Demo
                        </Badge>
                      )}
                      {project.github_url && (
                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                          <Github className="h-3 w-3 mr-1" />
                          Source Code
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => removeProject(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-orange-800 font-medium text-base">Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  placeholder="My Awesome Project"
                  className="border-orange-200 focus:border-orange-400 font-medium text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-orange-800 font-medium">Project Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  placeholder="Describe what this project does, the problem it solves, and your role in building it..."
                  rows={4}
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="h-5 w-5 text-slate-600" />
                  <Label className="text-slate-800 font-medium">Technology Stack</Label>
                </div>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newTechInputs[index] || ""}
                    onChange={(e) => setNewTechInputs({ ...newTechInputs, [index]: e.target.value })}
                    placeholder="Add technology (React, Node.js, Python...)"
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className="border-slate-200 focus:border-slate-400"
                  />
                  <Button
                    type="button"
                    onClick={() => addTechnology(index, newTechInputs[index] || "")}
                    size="sm"
                    variant="outline"
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <Badge
                        key={techIndex}
                        className="flex items-center gap-1 bg-slate-200 text-slate-800 hover:bg-slate-300"
                      >
                        {tech}
                        <button onClick={() => removeTechnology(index, techIndex)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <Label className="text-orange-800 font-medium mb-3 block">Project Timeline</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-orange-600">Started</Label>
                        <Input
                          type="date"
                          value={project.start_date}
                          onChange={(e) => updateProject(index, "start_date", e.target.value)}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-orange-600">Completed</Label>
                        <Input
                          type="date"
                          value={project.end_date}
                          onChange={(e) => updateProject(index, "end_date", e.target.value)}
                          disabled={project.is_ongoing}
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <Checkbox
                        id={`ongoing-${index}`}
                        checked={project.is_ongoing}
                        onCheckedChange={(checked) => updateProject(index, "is_ongoing", checked)}
                      />
                      <Label htmlFor={`ongoing-${index}`} className="text-orange-700 text-sm">
                        Ongoing project
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-orange-800 font-medium flex items-center gap-1">
                      <ExternalLink className="h-4 w-4" />
                      Project Links
                    </Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-orange-600">Live Demo URL</Label>
                        <Input
                          value={project.url}
                          onChange={(e) => updateProject(index, "url", e.target.value)}
                          placeholder="https://myproject.com"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-orange-600">GitHub Repository</Label>
                        <Input
                          value={project.github_url}
                          onChange={(e) => updateProject(index, "github_url", e.target.value)}
                          placeholder="https://github.com/username/project"
                          className="border-orange-200 focus:border-orange-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-orange-300">
          <CardContent className="text-center py-12">
            <Rocket className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <p className="text-orange-600 mb-2 text-lg">Build your project portfolio</p>
            <p className="text-orange-500 mb-4">Showcase the projects that demonstrate your skills and creativity</p>
            <Button onClick={addProject} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
