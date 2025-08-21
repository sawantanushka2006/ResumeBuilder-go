"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ResumeCard from "@/components/resume-card"
import Link from "next/link"
import { Plus, FileText, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const supabase = createClient()

    try {
      // Get user
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        router.push("/auth/login")
        return
      }

      setUser(userData.user)

      // Get user's resumes
      const { data: resumesData } = await supabase.from("resumes").select("*").order("updated_at", { ascending: false })

      setResumes(resumesData || [])

      // Get user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single()

      setProfile(profileData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDeleteResume = (deletedId: string) => {
    setResumes(resumes.filter((resume) => resume.id !== deletedId))
  }

  const handleDuplicateResume = (newResumeId: string) => {
    // Reload data to get the new resume
    loadData()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">Welcome back, {profile?.first_name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button onClick={handleSignOut} variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Resumes ({resumes.length})</h2>
            <Button asChild>
              <Link href="/resume/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Link>
            </Button>
          </div>

          {resumes && resumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDeleteResume}
                  onDuplicate={handleDuplicateResume}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-6">Create your first professional resume to get started</p>
                <Button asChild>
                  <Link href="/resume/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Resume
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
