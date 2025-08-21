"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GraduationCap, Calendar } from "lucide-react"

interface EducationFormProps {
  data: any[]
  onChange: (data: any[]) => void
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
        is_current: false,
        cgpa: "",
        percentage: "",
        semester: "",
        extra_certifications: "",
        description: "",
        tenth_marks: "",
        twelfth_marks: "",
      },
    ])
  }

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Educational Background</h2>
              <p className="text-blue-700">Your academic journey and current studies</p>
            </div>
          </div>
          <Button onClick={addEducation} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      </div>

      <div className="relative">
        {data.length > 0 && <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>}

        {data.map((education, index) => (
          <div key={index} className="relative flex gap-6 mb-8">
            <div className="flex-shrink-0 w-16 flex justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md"></div>
            </div>

            <Card className="flex-1 border-l-4 border-l-blue-500 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg text-blue-900">
                      {education.institution || `Education ${index + 1}`}
                    </CardTitle>
                  </div>
                  <Button
                    onClick={() => removeEducation(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {education.degree && <p className="text-blue-700 font-medium">{education.degree}</p>}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-800">Institution/College</Label>
                    <Input
                      value={education.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      placeholder="ABC College of Engineering"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-800">Degree</Label>
                    <Select value={education.degree} onValueChange={(value) => updateEducation(index, "degree", value)}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BSc Information Technology">BSc Information Technology</SelectItem>
                        <SelectItem value="BSc Computer Science">BSc Computer Science</SelectItem>
                        <SelectItem value="BCA">BCA (Bachelor of Computer Applications)</SelectItem>
                        <SelectItem value="HSC Science">HSC (12th Science)</SelectItem>
                        <SelectItem value="SSC">SSC (10th Standard)</SelectItem>
                        <SelectItem value="Diploma">Diploma in IT/CS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-800">Specialization/Stream</Label>
                  <Input
                    value={education.field_of_study}
                    onChange={(e) => updateEducation(index, "field_of_study", e.target.value)}
                    placeholder="Information Technology, Computer Science, etc."
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <Label className="text-blue-800 font-medium">Study Period</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-blue-700">Start Date</Label>
                      <Input
                        type="date"
                        value={education.start_date}
                        onChange={(e) => updateEducation(index, "start_date", e.target.value)}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-blue-700">End Date</Label>
                      <Input
                        type="date"
                        value={education.end_date}
                        onChange={(e) => updateEducation(index, "end_date", e.target.value)}
                        disabled={education.is_current}
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Checkbox
                      id={`current-${index}`}
                      checked={education.is_current}
                      onCheckedChange={(checked) => updateEducation(index, "is_current", checked)}
                    />
                    <Label htmlFor={`current-${index}`} className="text-blue-700">
                      Currently studying here
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-800">CGPA/SGPA</Label>
                    <Input
                      value={education.cgpa}
                      onChange={(e) => updateEducation(index, "cgpa", e.target.value)}
                      placeholder="8.5/10"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-800">Percentage</Label>
                    <Input
                      value={education.percentage}
                      onChange={(e) => updateEducation(index, "percentage", e.target.value)}
                      placeholder="85%"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-800">10th Marks (Optional)</Label>
                    <Input
                      value={education.tenth_marks}
                      onChange={(e) => updateEducation(index, "tenth_marks", e.target.value)}
                      placeholder="90%"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-800">12th Marks (Optional)</Label>
                    <Input
                      value={education.twelfth_marks}
                      onChange={(e) => updateEducation(index, "twelfth_marks", e.target.value)}
                      placeholder="85%"
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-800">Current Semester</Label>
                  <Select
                    value={education.semester}
                    onValueChange={(value) => updateEducation(index, "semester", value)}
                  >
                    <SelectTrigger className="border-blue-200 focus:border-blue-400">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Semester</SelectItem>
                      <SelectItem value="2">2nd Semester</SelectItem>
                      <SelectItem value="3">3rd Semester</SelectItem>
                      <SelectItem value="4">4th Semester</SelectItem>
                      <SelectItem value="5">5th Semester</SelectItem>
                      <SelectItem value="6">6th Semester</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-800">Extra Certifications & Courses (Optional)</Label>
                  <Textarea
                    value={education.extra_certifications}
                    onChange={(e) => updateEducation(index, "extra_certifications", e.target.value)}
                    placeholder="AWS Cloud Practitioner, Google Analytics, Coursera Python Course, Udemy Web Development..."
                    rows={2}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-800">Academic Achievements & Projects (Optional)</Label>
                  <Textarea
                    value={education.description}
                    onChange={(e) => updateEducation(index, "description", e.target.value)}
                    placeholder="Academic projects, awards, research work, extracurricular activities..."
                    rows={3}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <Card className="border-2 border-dashed border-blue-300">
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <p className="text-blue-600 mb-4 text-lg">Start building your academic profile</p>
            <Button onClick={addEducation} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your Education
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
