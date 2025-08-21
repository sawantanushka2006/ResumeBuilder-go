import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ResumePreview from "@/components/resume-preview"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, Download } from "lucide-react"

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get resume data
  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (resumeError || !resume) {
    redirect("/dashboard")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get all resume sections
  const [{ data: education }, { data: experience }, { data: skills }, { data: projects }] = await Promise.all([
    supabase.from("education").select("*").eq("resume_id", id).order("sort_order"),
    supabase.from("experience").select("*").eq("resume_id", id).order("sort_order"),
    supabase.from("skills").select("*").eq("resume_id", id).order("sort_order"),
    supabase.from("projects").select("*").eq("resume_id", id).order("sort_order"),
  ])

  const resumeData = {
    ...resume,
    profile: profile || {},
    education: education || [],
    experience: experience || [],
    skills: skills || [],
    projects: projects || [],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Preview: {resume.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href={`/resume/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/api/resume/${id}/pdf`} target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ResumePreview data={resumeData} />
        </div>
      </main>
    </div>
  )
}
