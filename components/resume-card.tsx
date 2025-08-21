"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { FileText, MoreVertical, Edit, Eye, Download, Copy, Trash2 } from "lucide-react"

interface ResumeCardProps {
  resume: any
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export default function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/resume/${resume.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete resume")
      }

      toast({
        title: "Success",
        description: "Resume deleted successfully",
      })

      onDelete(resume.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const response = await fetch(`/api/resume/duplicate/${resume.id}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to duplicate resume")
      }

      const newResume = await response.json()

      toast({
        title: "Success",
        description: "Resume duplicated successfully",
      })

      onDuplicate(newResume.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate resume",
        variant: "destructive",
      })
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-1">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate">{resume.title}</CardTitle>
                <CardDescription>Last updated: {new Date(resume.updated_at).toLocaleDateString()}</CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/resume/${resume.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/resume/${resume.id}/preview`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/api/resume/${resume.id}/pdf`} target="_blank">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
                  <Copy className="h-4 w-4 mr-2" />
                  {isDuplicating ? "Duplicating..." : "Duplicate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600 focus:text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/resume/${resume.id}/edit`}>Edit</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
              <Link href={`/resume/${resume.id}/preview`}>Preview</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resume.title}"? This action cannot be undone and will permanently remove
              your resume and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Deleting..." : "Delete Resume"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
