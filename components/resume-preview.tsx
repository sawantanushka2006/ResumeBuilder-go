"use client"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar } from "lucide-react"

interface ResumePreviewProps {
  data: any
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const { profile, education, experience, skills, projects, title } = data

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const formatDateRange = (startDate: string, endDate: string, isCurrent: boolean) => {
    const start = formatDate(startDate)
    const end = isCurrent ? "Present" : formatDate(endDate)
    return `${start} - ${end}`
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-6" id="resume-content">
      {title && (
        <div className="text-center mb-4">
          <h2 className="text-lg font-medium text-gray-600 uppercase tracking-wide">{title}</h2>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-8 border-b border-gray-200 pb-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {profile.first_name} {profile.last_name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 text-sm">
            {profile.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <a href={profile.website} className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            )}
            {profile.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-4 w-4" />
                <a href={profile.linkedin} className="text-blue-600 hover:underline">
                  LinkedIn
                </a>
              </div>
            )}
            {profile.github && (
              <div className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <a href={profile.github} className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            Experience
          </h2>

          <div className="space-y-6">
            {experience.map((act: any, index: number) => (
              <div key={index} className="relative border p-4 rounded-lg shadow-sm bg-white">
                {/* Header - Activity Name & Type */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{act.activity_name}</h3>
                    {act.activity_type && (
                      <p className="text-blue-600 font-medium">{act.activity_type}</p>
                    )}
                    {act.organization && (
                      <p className="text-gray-600 text-sm">{act.organization}</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-right text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateRange(act.start_date, act.end_date, act.is_current)}</span>
                  </div>
                </div>

                {/* Role */}
                {act.role && <p className="text-gray-700 mb-2"><span className="font-medium">Role:</span> {act.role}</p>}

                {/* Team Size */}
                {act.team_size && <p className="text-gray-700 mb-2"><span className="font-medium">Team Size:</span> {act.team_size}</p>}

                {/* Contribution */}
                {act.contribution && (
                  <div className="mb-2">
                    <p className="font-medium text-gray-800">Contribution & Responsibilities:</p>
                    <p className="text-gray-700">{act.contribution}</p>
                  </div>
                )}

                {/* Achievements */}
                {act.achievements && act.achievements.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-800">Achievements & Impact:</p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {act.achievements.map((achievement: string, achIndex: number) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Education Section */}
      {education && education.length > 0 && (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
          Education
        </h2>

        <div className="space-y-6">
          {education.map((edu: any, index: number) => (
            <div
              key={index}
              className="relative border p-4 rounded-lg shadow-sm bg-white"
            >
              {/* Institution & Degree */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-blue-600 font-medium">{edu.institution}</p>
                  {edu.field_of_study && (
                    <p className="text-gray-600">{edu.field_of_study}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="text-right text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                  </span>
                </div>
              </div>

              {/* Academic Details */}
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                {edu.cgpa && (
                  <p>
                    <span className="font-medium">CGPA/SGPA:</span> {edu.cgpa}
                  </p>
                )}
                {edu.percentage && (
                  <p>
                    <span className="font-medium">Percentage:</span> {edu.percentage}
                  </p>
                )}
                {edu.tenth_marks && (
                  <p>
                    <span className="font-medium">10th Marks:</span> {edu.tenth_marks}
                  </p>
                )}
                {edu.twelfth_marks && (
                  <p>
                    <span className="font-medium">12th Marks:</span> {edu.twelfth_marks}
                  </p>
                )}
                {edu.semester && (
                  <p>
                    <span className="font-medium">Current Semester:</span> {edu.semester}
                  </p>
                )}
              </div>

              {/* Extra Certifications */}
              {edu.extra_certifications && (
                <div className="mb-2">
                  <p className="font-medium text-gray-800">Extra Certifications & Courses:</p>
                  <p className="text-gray-700">{edu.extra_certifications}</p>
                </div>
              )}

              {/* Academic Achievements / Projects */}
              {edu.description && (
                <div>
                  <p className="font-medium text-gray-800">Academic Achievements & Projects:</p>
                  <p className="text-gray-700">{edu.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}


      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Skills</h2>
          <div className="space-y-4">
            {skills.map((skillCategory: any, index: number) => (
              <div key={index} className="relative border p-4 rounded-lg shadow-sm bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{skillCategory.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillCategory.skills.map((skill: string, skillIndex: number) => (
                    <Badge key={skillIndex} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Projects</h2>
          <div className="space-y-6">
            {projects.map((project: any, index: number) => (
              <div key={index} className="relative border p-4 rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {project.url && (
                        <a href={project.url} className="text-blue-600 hover:underline">
                          Live Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} className="text-blue-600 hover:underline">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateRange(project.start_date, project.end_date, project.is_ongoing)}</span>
                  </div>
                </div>
                {project.description && <p className="text-gray-700 mb-2">{project.description}</p>}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
