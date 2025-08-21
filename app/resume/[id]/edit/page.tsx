import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ResumeFormWithPreview from "@/components/resume-form-with-preview"

interface EditResumePageProps {
  params: Promise<{ id: string }>
}

export default async function EditResumePage({ params }: EditResumePageProps) {
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Resume: {resume.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResumeFormWithPreview initialData={resumeData} />
      </main>
    </div>
  )
}
