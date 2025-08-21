"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import PersonalInfoForm from "./forms/personal-info-form"
import EducationForm from "./forms/education-form"
import ExperienceForm from "./forms/experience-form"
import SkillsForm from "./forms/skills-form"
import ProjectsForm from "./forms/projects-form"
import { Save, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ResumeFormProps {
  initialData?: any
}

export default function ResumeForm({ initialData }: ResumeFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const router = useRouter()

  const titleSuggestions = [
    "BSc IT Student Resume",
    "Computer Science Student Resume",
    "Information Technology Resume",
    "Software Development Resume",
    "Web Development Resume",
    "Data Science Resume",
    "Cybersecurity Resume",
    "Mobile App Development Resume",
    "Full Stack Developer Resume",
    "Frontend Developer Resume",
    "Backend Developer Resume",
    "My Professional Resume",
  ]

  const [personalInfo, setPersonalInfo] = useState(initialData?.personalInfo || {})
  const [education, setEducation] = useState(initialData?.education || [])
  const [experience, setExperience] = useState(initialData?.experience || [])
  const [skills, setSkills] = useState(initialData?.skills || [])
  const [projects, setProjects] = useState(initialData?.projects || [])

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a resume title",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      let resumeId = initialData?.id

      // Create or update resume
      if (resumeId) {
        const { error } = await supabase
          .from("resumes")
          .update({ title, updated_at: new Date().toISOString() })
          .eq("id", resumeId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from("resumes").insert({ title, user_id: user.id }).select().single()
        if (error) throw error
        resumeId = data.id
      }

      // Update profile with personal info
      await supabase.from("profiles").update(personalInfo).eq("id", user.id)

      // Save education
      if (education.length > 0) {
        await supabase.from("education").delete().eq("resume_id", resumeId)
        const educationData = education.map((edu: any, index: number) => ({
          ...edu,
          resume_id: resumeId,
          sort_order: index,
        }))
        await supabase.from("education").insert(educationData)
      }

      // Save experience
      if (experience.length > 0) {
        await supabase.from("experience").delete().eq("resume_id", resumeId)
        const experienceData = experience.map((exp: any, index: number) => ({
          ...exp,
          resume_id: resumeId,
          sort_order: index,
        }))
        await supabase.from("experience").insert(experienceData)
      }

      // Save skills
      if (skills.length > 0) {
        await supabase.from("skills").delete().eq("resume_id", resumeId)
        const skillsData = skills.map((skill: any, index: number) => ({
          ...skill,
          resume_id: resumeId,
          sort_order: index,
        }))
        await supabase.from("skills").insert(skillsData)
      }

      // Save projects
      if (projects.length > 0) {
        await supabase.from("projects").delete().eq("resume_id", resumeId)
        const projectsData = projects.map((project: any, index: number) => ({
          ...project,
          resume_id: resumeId,
          sort_order: index,
        }))
        await supabase.from("projects").insert(projectsData)
      }

      toast({
        title: "Success",
        description: "Resume saved successfully!",
      })

      if (!initialData?.id) {
        router.push(`/resume/${resumeId}/edit`)
      }
    } catch (error) {
      console.error("Error saving resume:", error)
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Resume Details</CardTitle>
              <CardDescription>Enter your resume information below</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                placeholder="e.g., BSc IT Student Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                list="title-suggestions"
              />
              <datalist id="title-suggestions">
                {titleSuggestions.map((suggestion, index) => (
                  <option key={index} value={suggestion} />
                ))}
              </datalist>
              <p className="text-sm text-muted-foreground">
                Start typing to see suggestions, or create your own custom title
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoForm data={personalInfo} onChange={setPersonalInfo} />
        </TabsContent>

        <TabsContent value="education">
          <EducationForm data={education} onChange={setEducation} />
        </TabsContent>

        <TabsContent value="experience">
          <ExperienceForm data={experience} onChange={setExperience} />
        </TabsContent>

        <TabsContent value="skills">
          <SkillsForm data={skills} onChange={setSkills} />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsForm data={projects} onChange={setProjects} />
        </TabsContent>
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Resume"}
        </Button>
        {initialData?.id && (
          <Button asChild variant="outline">
            <Link href={`/resume/${initialData.id}/preview`}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
