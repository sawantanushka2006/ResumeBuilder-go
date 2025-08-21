import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import puppeteer from "puppeteer"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Get resume data
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (resumeError || !resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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

    // Generate HTML for PDF
    const html = generateResumeHTML(resumeData)

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
    })

    await browser.close()

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}

function generateResumeHTML(data: any) {
  const { profile, education, experience, skills, projects } = data

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

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: white;
        }
        
        .container {
          max-width: 8.5in;
          margin: 0 auto;
          padding: 0.5in;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: #6b7280;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .experience-item, .education-item, .project-item {
          margin-bottom: 1.5rem;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .item-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
        }
        
        .item-company {
          color: #2563eb;
          font-weight: 500;
        }
        
        .item-location {
          color: #6b7280;
          font-size: 0.9rem;
        }
        
        .item-date {
          color: #6b7280;
          font-size: 0.9rem;
          text-align: right;
        }
        
        .item-description {
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .achievements {
          list-style-type: disc;
          margin-left: 1.5rem;
          color: #374151;
        }
        
        .achievements li {
          margin-bottom: 0.25rem;
        }
        
        .skills-category {
          margin-bottom: 1rem;
        }
        
        .skills-category-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .skill-tag {
          background: #f3f4f6;
          color: #374151;
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          border: 1px solid #d1d5db;
        }
        
        .tech-tag {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          border: 1px solid #fbbf24;
        }
        
        .project-links {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .project-link {
          color: #2563eb;
          text-decoration: none;
          font-size: 0.9rem;
        }
        
        .project-link:hover {
          text-decoration: underline;
        }
        
        .technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        @media print {
          .container {
            padding: 0;
          }
          
          .section {
            page-break-inside: avoid;
          }
          
          .experience-item, .education-item, .project-item {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <header class="header">
          <h1>${profile.first_name || ""} ${profile.last_name || ""}</h1>
          <div class="contact-info">
            ${profile.email ? `<div class="contact-item">📧 ${profile.email}</div>` : ""}
            ${profile.phone ? `<div class="contact-item">📞 ${profile.phone}</div>` : ""}
            ${profile.location ? `<div class="contact-item">📍 ${profile.location}</div>` : ""}
            ${profile.website ? `<div class="contact-item">🌐 <a href="${profile.website}" class="project-link">Website</a></div>` : ""}
            ${profile.linkedin ? `<div class="contact-item">💼 <a href="${profile.linkedin}" class="project-link">LinkedIn</a></div>` : ""}
            ${profile.github ? `<div class="contact-item">💻 <a href="${profile.github}" class="project-link">GitHub</a></div>` : ""}
          </div>
        </header>

        <!-- Experience -->
        ${
          experience && experience.length > 0
            ? `
        <section class="section">
          <h2 class="section-title">Experience</h2>
          ${experience
            .map(
              (exp: any) => `
            <div class="experience-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.position || ""}</div>
                  <div class="item-company">${exp.company || ""}</div>
                  ${exp.location ? `<div class="item-location">${exp.location}</div>` : ""}
                </div>
                <div class="item-date">📅 ${formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</div>
              </div>
              ${exp.description ? `<div class="item-description">${exp.description}</div>` : ""}
              ${
                exp.achievements && exp.achievements.length > 0
                  ? `
                <ul class="achievements">
                  ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join("")}
                </ul>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </section>
        `
            : ""
        }

        <!-- Education -->
        ${
          education && education.length > 0
            ? `
        <section class="section">
          <h2 class="section-title">Education</h2>
          ${education
            .map(
              (edu: any) => `
            <div class="education-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree || ""}</div>
                  <div class="item-company">${edu.institution || ""}</div>
                  ${edu.field_of_study ? `<div class="item-location">${edu.field_of_study}</div>` : ""}
                  ${edu.gpa ? `<div class="item-location">GPA: ${edu.gpa}</div>` : ""}
                </div>
                <div class="item-date">📅 ${formatDateRange(edu.start_date, edu.end_date, edu.is_current)}</div>
              </div>
              ${edu.description ? `<div class="item-description">${edu.description}</div>` : ""}
            </div>
          `,
            )
            .join("")}
        </section>
        `
            : ""
        }

        <!-- Skills -->
        ${
          skills && skills.length > 0
            ? `
        <section class="section">
          <h2 class="section-title">Skills</h2>
          ${skills
            .map(
              (skillCategory: any) => `
            <div class="skills-category">
              <div class="skills-category-title">${skillCategory.category || ""}</div>
              <div class="skills-list">
                ${skillCategory.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join("")}
              </div>
            </div>
          `,
            )
            .join("")}
        </section>
        `
            : ""
        }

        <!-- Projects -->
        ${
          projects && projects.length > 0
            ? `
        <section class="section">
          <h2 class="section-title">Projects</h2>
          ${projects
            .map(
              (project: any) => `
            <div class="project-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${project.name || ""}</div>
                  <div class="project-links">
                    ${project.url ? `<a href="${project.url}" class="project-link">Live Demo</a>` : ""}
                    ${project.github_url ? `<a href="${project.github_url}" class="project-link">GitHub</a>` : ""}
                  </div>
                </div>
                <div class="item-date">📅 ${formatDateRange(project.start_date, project.end_date, project.is_ongoing)}</div>
              </div>
              ${project.description ? `<div class="item-description">${project.description}</div>` : ""}
              ${
                project.technologies && project.technologies.length > 0
                  ? `
                <div class="technologies">
                  ${project.technologies.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join("")}
                </div>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </section>
        `
            : ""
        }
      </div>
    </body>
    </html>
  `
}
