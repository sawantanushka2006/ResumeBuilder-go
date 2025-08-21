"use client"

import { useEffect, useState } from "react"
import ResumePreview from "./resume-preview"

interface ResumePreviewLiveProps {
  resumeId?: string
  formData?: any
}

export default function ResumePreviewLive({ resumeId, formData }: ResumePreviewLiveProps) {
  const [previewData, setPreviewData] = useState(null)

  useEffect(() => {
    if (formData) {
      // Use form data for real-time preview
      setPreviewData(formData)
    } else if (resumeId) {
      // Fetch data for existing resume
      // This would be implemented when needed for real-time updates
    }
  }, [formData, resumeId])

  if (!previewData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Preview will appear here as you fill out the form</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <ResumePreview data={previewData} />
    </div>
  )
}
