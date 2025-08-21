"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInfoFormProps {
  data: any
  onChange: (data: any) => void
}

export default function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Enter your contact details and personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={data.first_name || ""}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="John"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={data.last_name || ""}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="City, State, Country"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="linkedin">
            LinkedIn <span className="text-muted-foreground text-sm">(Optional)</span>
          </Label>
          <Input
            id="linkedin"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="github">
            GitHub <span className="text-muted-foreground text-sm">(Optional)</span>
          </Label>
          <Input
            id="github"
            value={data.github || ""}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder="https://github.com/yourusername"
          />
        </div>
      </CardContent>
    </Card>
  )
}
