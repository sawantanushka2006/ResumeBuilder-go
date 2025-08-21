"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Users, Trophy, Star } from "lucide-react"

interface ExperienceFormProps {
  data: any[]
  onChange: (data: any[]) => void
}

export default function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        activity_name: "",
        activity_type: "",
        organization: "",
        role: "",
        start_date: "",
        end_date: "",
        is_current: false,
        team_size: "",
        contribution: "",
        achievements: [],
      },
    ])
  }

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const updateAchievements = (index: number, achievements: string) => {
    const achievementArray = achievements.split("\n").filter((line) => line.trim())
    updateExperience(index, "achievements", achievementArray)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-emerald-900">College Activities & Experience</h2>
              <p className="text-emerald-700">Your participation in fests, events, and team activities</p>
            </div>
          </div>
          <Button onClick={addExperience} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </div>

      {data.map((experience, index) => (
        <Card key={index} className="border-l-4 border-l-emerald-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Star className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-emerald-900">
                    {experience.activity_name || `Activity ${index + 1}`}
                  </CardTitle>
                  {experience.organization && (
                    <p className="text-emerald-700 font-medium flex items-center gap-1">
                      <span>{experience.role}</span> at {experience.organization}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => removeExperience(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Activity/Event Name</Label>
                  <Input
                    value={experience.activity_name}
                    onChange={(e) => updateExperience(index, "activity_name", e.target.value)}
                    placeholder="College Fest, Tech Symposium, Cultural Event"
                    className="border-emerald-200 focus:border-emerald-400 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Activity Type</Label>
                  <Select
                    value={experience.activity_type}
                    onValueChange={(value) => updateExperience(index, "activity_type", value)}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internship">Internship</SelectItem>
                      <SelectItem value="part_time_job">Part-time Job</SelectItem>
                      <SelectItem value="freelance_project">Freelance Project</SelectItem>
                      <SelectItem value="college_fest">College Fest</SelectItem>
                      <SelectItem value="technical_event">Technical Event</SelectItem>
                      <SelectItem value="cultural_event">Cultural Event</SelectItem>
                      <SelectItem value="sports_event">Sports Event</SelectItem>
                      <SelectItem value="student_council">Student Council</SelectItem>
                      <SelectItem value="volunteer_work">Volunteer Work</SelectItem>
                      <SelectItem value="competition">Competition</SelectItem>
                      <SelectItem value="workshop">Workshop/Seminar</SelectItem>
                      <SelectItem value="research_project">Research Project</SelectItem>
                      <SelectItem value="coding_bootcamp">Coding Bootcamp</SelectItem>
                      <SelectItem value="online_course">Online Course/Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Organization/Committee</Label>
                  <Input
                    value={experience.organization}
                    onChange={(e) => updateExperience(index, "organization", e.target.value)}
                    placeholder="Company Name, Student Council, Event Committee, Club Name"
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Your Role</Label>
                  <Input
                    value={experience.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    placeholder="Intern, Developer, Team Member, Coordinator, Volunteer"
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <Label className="text-emerald-800 font-medium mb-3 block">Duration</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-emerald-600">From</Label>
                      <Input
                        type="date"
                        value={experience.start_date}
                        onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-emerald-600">To</Label>
                      <Input
                        type="date"
                        value={experience.end_date}
                        onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                        disabled={experience.is_current}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox
                      id={`current-exp-${index}`}
                      checked={experience.is_current}
                      onCheckedChange={(checked) => updateExperience(index, "is_current", checked)}
                    />
                    <Label htmlFor={`current-exp-${index}`} className="text-emerald-700 text-sm">
                      Currently participating
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-emerald-800 font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Size (if applicable)
              </Label>
              <Input
                value={experience.team_size}
                onChange={(e) => updateExperience(index, "team_size", e.target.value)}
                placeholder="5 members, 10-person committee, etc."
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-emerald-800 font-medium">Your Contribution & Responsibilities</Label>
              <Textarea
                value={experience.contribution}
                onChange={(e) => updateExperience(index, "contribution", e.target.value)}
                placeholder="Describe your work, responsibilities, technologies used, projects completed, or how you contributed to the team/event..."
                rows={3}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-amber-600" />
                <Label className="text-amber-800 font-medium">Achievements & Impact</Label>
              </div>
              <Textarea
                value={experience.achievements?.join("\n") || ""}
                onChange={(e) => updateAchievements(index, e.target.value)}
                placeholder="• Completed 3-month internship developing web applications\n• Built responsive website using React and Node.js\n• Successfully organized event with 500+ participants\n• Led team that won 1st prize in technical competition\n• Earned certification in Python programming\n• Freelanced for 2 local businesses creating their websites"
                rows={4}
                className="border-amber-200 focus:border-amber-400 bg-white"
              />
              <p className="text-xs text-amber-600 mt-2">Highlight your achievements, awards, and measurable impact</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-emerald-300">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-emerald-600 mb-4 text-lg">Showcase your college involvement</p>
            <Button onClick={addExperience} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Activity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
