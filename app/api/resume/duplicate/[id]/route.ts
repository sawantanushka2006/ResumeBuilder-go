import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get original resume
    const { data: originalResume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (resumeError || !originalResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Create duplicate resume
    const { data: newResume, error: createError } = await supabase
      .from("resumes")
      .insert({
        title: `${originalResume.title} (Copy)`,
        template: originalResume.template,
        is_public: false,
        user_id: user.id,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: "Failed to duplicate resume" }, { status: 500 })
    }

    // Get all sections from original resume
    const [{ data: education }, { data: experience }, { data: skills }, { data: projects }] = await Promise.all([
      supabase.from("education").select("*").eq("resume_id", id),
      supabase.from("experience").select("*").eq("resume_id", id),
      supabase.from("skills").select("*").eq("resume_id", id),
      supabase.from("projects").select("*").eq("resume_id", id),
    ])

    // Duplicate all sections
    if (education && education.length > 0) {
      const educationData = education.map((edu) => ({
        ...edu,
        id: undefined,
        resume_id: newResume.id,
        created_at: undefined,
        updated_at: undefined,
      }))
      await supabase.from("education").insert(educationData)
    }

    if (experience && experience.length > 0) {
      const experienceData = experience.map((exp) => ({
        ...exp,
        id: undefined,
        resume_id: newResume.id,
        created_at: undefined,
        updated_at: undefined,
      }))
      await supabase.from("experience").insert(experienceData)
    }

    if (skills && skills.length > 0) {
      const skillsData = skills.map((skill) => ({
        ...skill,
        id: undefined,
        resume_id: newResume.id,
        created_at: undefined,
        updated_at: undefined,
      }))
      await supabase.from("skills").insert(skillsData)
    }

    if (projects && projects.length > 0) {
      const projectsData = projects.map((project) => ({
        ...project,
        id: undefined,
        resume_id: newResume.id,
        created_at: undefined,
        updated_at: undefined,
      }))
      await supabase.from("projects").insert(projectsData)
    }

    return NextResponse.json(newResume)
  } catch (error) {
    console.error("Duplicate resume error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
