"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  Eye,
  Download,
  Plus,
  Trash2,
  Sparkles,
  Wand2,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Rocket,
  Settings,
  Palette,
  Zap,
  Target,
  Crown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { use } from "react"
import ResumePreview from "@/components/ResumePreview"
import { apiClient } from "@/lib/api"

interface Resume {
  id: number
  title: string
  createdAt: string
  updatedAt: string
  template?: string
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
    about: string
  }
  experiences: Array<{
    id: number
    company: string
    position: string
    duration: string
    bullets: string[]
  }>
  educations: Array<{
    id: number
    institution: string
    degree: string
    duration: string
    achievements: string[]
  }>
  skills: string[]
  projects: Array<{
    id: number
    name: string
    description: string
    technologies: string[]
    link?: string
  }>
  certifications: Array<{
    id: number
    name: string
    issuer: string
    date: string
  }>
}

export default function ResumeBuilder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [hasMounted, setHasMounted] = useState(false)
  const [resume, setResume] = useState<Resume | null>(null)
  const [activeSection, setActiveSection] = useState("personal")
  const [isAIMode, setIsAIMode] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isAICollapsed, setIsAICollapsed] = useState(false)

  useEffect(() => { setHasMounted(true) }, [])

  useEffect(() => {
    if (!hasMounted) return

    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    // Load resume data
    const savedResumes = localStorage.getItem("resumes")
    if (savedResumes) {
      try {
        const resumes = JSON.parse(savedResumes)
        const currentResume = resumes.find((r: Resume) => r.id === Number.parseInt(id))
        if (currentResume) {
          setResume(currentResume)
        } else {
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Error loading resume:", error)
        router.push("/dashboard")
        return
      }
    } else {
      router.push("/dashboard")
      return
    }

    // Trigger animations
    setTimeout(() => setIsVisible(true), 100)
  }, [hasMounted, id, router])

  const saveResume = () => {
    if (!resume) return

    const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]")
    const updatedResumes = savedResumes.map((r: Resume) =>
      r.id === resume.id ? { ...resume, updatedAt: new Date().toISOString() } : r,
    )
    localStorage.setItem("resumes", JSON.stringify(updatedResumes))
  }

  const updatePersonalInfo = (field: string, value: string) => {
    if (!resume) return
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    })
  }

  const addExperience = () => {
    if (!resume) return
    const newExperience = {
      id: Date.now(),
      company: "",
      position: "",
      duration: "",
      bullets: [""],
    }
    setResume({
      ...resume,
      experiences: [...resume.experiences, newExperience],
    })
  }

  const updateExperience = (id: number, field: string, value: string | string[]) => {
    if (!resume) return
    setResume({
      ...resume,
      experiences: resume.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (id: number) => {
    if (!resume) return
    setResume({
      ...resume,
      experiences: resume.experiences.filter((exp) => exp.id !== id),
    })
  }

  const addEducation = () => {
    if (!resume) return
    const newEducation = {
      id: Date.now(),
      institution: "",
      degree: "",
      duration: "",
      achievements: [""],
    }
    setResume({
      ...resume,
      educations: [...resume.educations, newEducation],
    })
  }

  const updateEducation = (id: number, field: string, value: string | string[]) => {
    if (!resume) return
    setResume({
      ...resume,
      educations: resume.educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (id: number) => {
    if (!resume) return
    setResume({
      ...resume,
      educations: resume.educations.filter((edu) => edu.id !== id),
    })
  }

  const addSkill = (skill: string) => {
    if (!resume || !skill.trim()) return
    
    // Check if skill already exists
    if (resume.skills.includes(skill.trim())) {
      toast({
        title: "Skill Already Exists",
        description: `"${skill.trim()}" is already in your skills list.`,
        variant: "default",
      })
      return
    }
    
    const updatedSkills = [...resume.skills, skill.trim()]
    setResume({
      ...resume,
      skills: updatedSkills,
    })
    
    toast({
      title: "Skill Added",
      description: `"${skill.trim()}" has been added to your skills.`,
      variant: "default",
    })
  }

  const removeSkill = (index: number) => {
    if (!resume) return
    const skillToRemove = resume.skills[index]
    const updatedSkills = resume.skills.filter((_, i) => i !== index)
    setResume({
      ...resume,
      skills: updatedSkills,
    })
    
    toast({
      title: "Skill Removed",
      description: `"${skillToRemove}" has been removed from your skills.`,
      variant: "default",
    })
  }

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return

    setIsGenerating(true)
    try {
      // Determine context based on active section and current data
      let context: any = 'resume_bullet_point'
      let requestData: any = {}

      switch (activeSection) {
        case 'experience':
          console.log('Experience section - checking resume data:', resume)
          if (resume && resume.experiences && resume.experiences.length > 0) {
            const currentExp = resume.experiences[resume.experiences.length - 1]
            console.log('Current experience:', currentExp)
            console.log('Company:', currentExp.company, 'Position:', currentExp.position)
            console.log('Company trimmed:', currentExp.company?.trim(), 'Position trimmed:', currentExp.position?.trim())
            
            if (currentExp.company && currentExp.position && currentExp.company.trim() && currentExp.position.trim()) {
              context = 'resume_bullet_point'
              requestData = {
                company: currentExp.company,
                position: currentExp.position,
                duration: currentExp.duration
              }
              console.log('Experience validation passed, using resume_bullet_point context')
            } else {
              // Show error if company/position are missing for experience
              console.log('Experience validation failed - missing company or position')
              toast({
                title: "Missing Information",
                description: "Please fill in the company name and position for your experience before generating bullet points.",
                variant: "destructive",
              })
      setIsGenerating(false)
              return
            }
          } else {
            // Show error if no experiences exist
            console.log('No experiences found')
            toast({
              title: "No Experience Added",
              description: "Please add an experience entry with company and position before generating bullet points.",
              variant: "destructive",
            })
            setIsGenerating(false)
            return
          }
          break
        case 'education':
          if (resume && resume.educations && resume.educations.length > 0) {
            const currentEdu = resume.educations[resume.educations.length - 1]
            if (currentEdu.institution && currentEdu.degree && currentEdu.institution.trim() && currentEdu.degree.trim()) {
              context = 'education_achievement'
              requestData = {
                institution: currentEdu.institution,
                degree: currentEdu.degree,
                duration: currentEdu.duration
              }
            } else {
              // Show error if institution/degree are missing for education
              toast({
                title: "Missing Information",
                description: "Please fill in the institution and degree for your education before generating achievements.",
                variant: "destructive",
              })
              setIsGenerating(false)
              return
            }
          } else {
            // Show error if no education exists
            toast({
              title: "No Education Added",
              description: "Please add an education entry with institution and degree before generating achievements.",
              variant: "destructive",
            })
            setIsGenerating(false)
            return
          }
          break
        case 'skills':
          context = 'skills_suggestion'
          const skillsPosition = resume?.personalInfo.title?.trim() || 'Software Engineer'
          requestData = {
            position: skillsPosition
          }
          break
        case 'projects':
          if (resume && resume.projects && resume.projects.length > 0) {
            const currentProject = resume.projects[resume.projects.length - 1]
            if (currentProject.name && currentProject.name.trim()) {
              context = 'project_description'
              requestData = {
                projectName: currentProject.name,
                position: resume.personalInfo.title
              }
            } else {
              // Show error if project name is missing
              toast({
                title: "Missing Project Name",
                description: "Please fill in the project name before generating a description.",
                variant: "destructive",
              })
              setIsGenerating(false)
              return
            }
          } else {
            // Show error if no projects exist
            toast({
              title: "No Projects Added",
              description: "Please add a project with a name before generating a description.",
              variant: "destructive",
            })
            setIsGenerating(false)
            return
          }
          break
        case 'certifications':
          context = 'certification_suggestion'
          const certPosition = resume?.personalInfo.title?.trim() || 'Software Engineer'
          requestData = {
            position: certPosition
          }
          break
        case 'personal':
          // For personal section, generate an "About Me" description
          context = 'about_me_description'
          const personalPosition = resume?.personalInfo.title?.trim() || 'Software Engineer'
          const personalName = resume?.personalInfo.name?.trim() || 'Professional'
          requestData = {
            position: personalPosition,
            name: personalName
          }
          break
        default:
          // For any other section, use skills suggestion as a safe fallback
          console.log('Default case triggered - activeSection:', activeSection)
          context = 'skills_suggestion'
          const defaultPosition = resume?.personalInfo.title?.trim() || 'Software Engineer'
          requestData = {
            position: defaultPosition
          }
                    console.log('Using skills_suggestion context with position:', defaultPosition)
        }

      // Debug: Log the final context and requestData after switch
      console.log('After switch - context:', context, 'requestData:', requestData, 'activeSection:', activeSection)

      // Comprehensive validation: ensure context and requestData are consistent
      if (context === 'resume_bullet_point') {
        if (!requestData.company || !requestData.position) {
          console.error('INCONSISTENCY: resume_bullet_point context without company/position')
          console.error('requestData:', requestData)
          console.error('activeSection:', activeSection)
          
          // Fallback to skills_suggestion if we don't have required data
          context = 'skills_suggestion'
          requestData = {
            position: resume?.personalInfo.title?.trim() || 'Software Engineer'
          }
          console.log('Falling back to skills_suggestion context')
        }
      }

      // Ensure we have a valid position for skills suggestions
      if (context === 'skills_suggestion') {
        // Always provide a valid position for skills suggestions
        const defaultPosition = activeSection === 'experience' ? 'Software Engineer' :
                              activeSection === 'education' ? 'Recent Graduate' :
                              activeSection === 'projects' ? 'Developer' :
                              activeSection === 'skills' ? 'Software Engineer' :
                              'Software Engineer'
        requestData.position = requestData.position || defaultPosition
      }
      
      // Final validation - ensure position is never empty
      if (!requestData.position || requestData.position.trim() === '') {
        requestData.position = 'Software Engineer'
      }

      // Additional validation for resume_bullet_point context
      if (context === 'resume_bullet_point' && (!requestData.company || !requestData.position)) {
        console.log('Validation failed: Missing company or position for resume_bullet_point context')
        console.log('requestData:', requestData)
        console.log('context:', context)
        toast({
          title: "Missing Required Information",
          description: "Company and position are required for generating bullet points. Please fill in these fields first.",
          variant: "destructive",
        })
        setIsGenerating(false)
        return
      }

      // Additional check: if we're in experience section but context is resume_bullet_point, ensure we have company/position
      if (activeSection === 'experience' && context === 'resume_bullet_point') {
        if (!requestData.company || !requestData.position) {
          console.log('CRITICAL: Experience section with resume_bullet_point context but missing company/position')
          console.log('requestData:', requestData)
          toast({
            title: "Missing Required Information",
            description: "Company and position are required for generating bullet points. Please fill in these fields first.",
            variant: "destructive",
          })
          setIsGenerating(false)
          return
        }
      }

      console.log('AI Request Data:', { context, ...requestData, activeSection })
      console.log('Resume data:', resume)
      console.log('Current experience:', resume?.experiences?.[resume?.experiences?.length - 1])
      console.log('Validation passed, proceeding with API call')
      
      // Final safety check before API call
      if (context === 'resume_bullet_point' && (!requestData.company || !requestData.position)) {
        console.error('CRITICAL: About to make API call with missing company/position for resume_bullet_point')
        toast({
          title: "Validation Error",
          description: "Cannot proceed with missing required information.",
          variant: "destructive",
        })
        setIsGenerating(false)
        return
      }
      
      const response = await apiClient.getAISuggestions({
        context,
        ...requestData
      })

      // Apply suggestions based on context and active section
      if (response.suggestions.length > 0 && resume) {
        let successMessage = ""
        
        switch (activeSection) {
          case 'experience':
            if (resume.experiences && resume.experiences.length > 0) {
              const updatedExperiences = [...resume.experiences]
              const currentExpIndex = updatedExperiences.length - 1
              updatedExperiences[currentExpIndex] = {
                ...updatedExperiences[currentExpIndex],
                bullets: response.suggestions
              }
              setResume({ ...resume, experiences: updatedExperiences })
              successMessage = `Generated ${response.suggestions.length} bullet points for your experience!`
            }
            break
          case 'education':
            if (resume.educations && resume.educations.length > 0) {
              const updatedEducations = [...resume.educations]
              const currentEduIndex = updatedEducations.length - 1
              updatedEducations[currentEduIndex] = {
                ...updatedEducations[currentEduIndex],
                achievements: response.suggestions
              }
              setResume({ ...resume, educations: updatedEducations })
              successMessage = `Generated ${response.suggestions.length} achievements for your education!`
            }
            break
          case 'skills':
            if (response.suggestions.length > 0) {
              const newSkills = [...(resume.skills || []), ...response.suggestions]
              setResume({ ...resume, skills: newSkills })
              successMessage = `Added ${response.suggestions.length} relevant skills to your resume!`
            }
            break
          case 'projects':
            if (resume.projects && resume.projects.length > 0 && response.suggestions.length > 0) {
              const updatedProjects = [...resume.projects]
              const currentProjectIndex = updatedProjects.length - 1
              updatedProjects[currentProjectIndex] = {
                ...updatedProjects[currentProjectIndex],
                description: response.suggestions[0]
              }
              setResume({ ...resume, projects: updatedProjects })
              successMessage = "Generated a professional project description!"
            }
            break
          case 'certifications':
            if (response.suggestions.length > 0) {
              const newCertifications = response.suggestions.map((cert, index) => ({
                id: Date.now() + index,
                name: cert,
                issuer: 'Professional Organization',
                date: new Date().getFullYear().toString()
              }))
              setResume({ 
                ...resume, 
                certifications: [...(resume.certifications || []), ...newCertifications] 
              })
              successMessage = `Added ${response.suggestions.length} relevant certifications!`
            }
            break
          case 'personal':
            if (response.suggestions.length > 0) {
              setResume({
                ...resume,
                personalInfo: {
                  ...resume.personalInfo,
                  about: response.suggestions[0]
                }
              })
              successMessage = "Generated a professional About Me description!"
            }
            break
        }
        
        if (successMessage) {
          toast({
            title: "AI Generation Successful!",
            description: successMessage,
            variant: "default",
          })
        }
      }

      setAiPrompt("")
    } catch (error) {
      console.error('AI generation error:', error)
      
      let errorMessage = "Failed to generate AI suggestions. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("Project name is required")) {
          errorMessage = "Please add a project name first, then try generating AI content."
        } else if (error.message.includes("Company and position are required")) {
          errorMessage = "Please add company and position details first, then try generating AI content."
        } else if (error.message.includes("Institution and degree are required")) {
          errorMessage = "Please add institution and degree details first, then try generating AI content."
        } else if (error.message.includes("Position is required")) {
          errorMessage = "Please add your professional title in Personal Information first, then try generating AI content."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "AI Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getTemplateInfo = (templateId?: string) => {
    const templates: Record<string, { name: string; color: string; icon: any }> = {
      professional: { name: "Professional", color: "bg-blue-500", icon: FileText },
      modern: { name: "Modern", color: "bg-purple-500", icon: Sparkles },
      creative: { name: "Creative", color: "bg-pink-500", icon: Palette },
      executive: { name: "Executive", color: "bg-gray-700", icon: Crown },
      academic: { name: "Academic", color: "bg-green-500", icon: Target },
      startup: { name: "Startup", color: "bg-red-500", icon: Zap },
      minimal: { name: "Minimal", color: "bg-gray-500", icon: FileText },
      tech: { name: "Tech", color: "bg-cyan-500", icon: Rocket },
    }
    return templates[templateId || "professional"] || templates.professional
  }

  if (!hasMounted) return null

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  const templateInfo = getTemplateInfo(resume.template)
  const IconComponent = templateInfo.icon

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "skills", name: "Skills", icon: Code },
    { id: "projects", name: "Projects", icon: Rocket },
    { id: "certifications", name: "Certifications", icon: Award },
    { id: "settings", name: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors group bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${templateInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900">{resume.title}</span>
                  <Badge className="ml-3 bg-blue-100 text-blue-700 text-xs font-medium">{templateInfo.name}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-2 rounded-lg">
                <Label htmlFor="ai-mode" className="text-sm font-medium text-slate-700">
                  AI Assistant
                </Label>
                <Switch id="ai-mode" checked={isAIMode} onCheckedChange={setIsAIMode} />
              </div>
              <Button
                onClick={saveResume}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 group"
              >
                <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                className={`border-2 font-semibold px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-300 ${
                  showPreview 
                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700' 
                    : 'border-blue-500 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-600'
                }`}
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Live Preview'}
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-purple-500 bg-white text-purple-600 hover:bg-purple-50 hover:border-purple-600 font-semibold px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  // Basic PDF export functionality
                  const printWindow = window.open('', '_blank')
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>${resume?.title || 'Resume'}</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                            .section { margin-bottom: 20px; }
                            .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                            .experience-item, .education-item { margin-bottom: 15px; }
                            .skills { display: flex; flex-wrap: wrap; gap: 5px; }
                            .skill { background: #f0f0f0; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
                            @media print { body { margin: 0; } }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>${resume?.personalInfo.name || 'Your Name'}</h1>
                            <p>${resume?.personalInfo.title || 'Professional Title'}</p>
                            <p>${resume?.personalInfo.email || ''} | ${resume?.personalInfo.phone || ''} | ${resume?.personalInfo.location || ''}</p>
                          </div>
                          ${resume?.personalInfo.about ? `<div class="section"><h2>About Me</h2><p>${resume.personalInfo.about}</p></div>` : ''}
                          ${resume?.experiences.length > 0 ? `
                            <div class="section">
                              <h2>Professional Experience</h2>
                              ${resume.experiences.map(exp => `
                                <div class="experience-item">
                                  <h3>${exp.position}</h3>
                                  <p><strong>${exp.company}</strong> | ${exp.duration}</p>
                                  ${exp.bullets.length > 0 ? `<ul>${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>` : ''}
                                </div>
                              `).join('')}
                            </div>
                          ` : ''}
                          ${resume?.educations.length > 0 ? `
                            <div class="section">
                              <h2>Education</h2>
                              ${resume.educations.map(edu => `
                                <div class="education-item">
                                  <h3>${edu.degree}</h3>
                                  <p><strong>${edu.institution}</strong> | ${edu.duration}</p>
                                  ${edu.achievements.length > 0 ? `<ul>${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}</ul>` : ''}
                                </div>
                              `).join('')}
                            </div>
                          ` : ''}
                          ${resume?.skills.length > 0 ? `
                            <div class="section">
                              <h2>Skills</h2>
                              <div class="skills">
                                ${resume.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                              </div>
                            </div>
                          ` : ''}
                        </body>
                      </html>
                    `)
                    printWindow.document.close()
                    printWindow.focus()
                    setTimeout(() => {
                      printWindow.print()
                      printWindow.close()
                    }, 500)
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 lg:grid-cols-4'}`}>
          {/* Sidebar */}
          <div
            className={`${showPreview ? 'xl:col-span-1' : 'lg:col-span-1'} transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Resume Sections
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-2 p-2">
                  {sections.map((section) => {
                    const SectionIcon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-300 rounded-lg ${
                          activeSection === section.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:scale-105"
                        }`}
                      >
                        <SectionIcon className="w-5 h-5" />
                        <span className="font-medium">{section.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            {isAIMode && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 mt-6 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                    AI Assistant
                      <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">Powered by Gemini</Badge>
                  </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAICollapsed(!isAICollapsed)}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                    >
                      {isAICollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {(!isAICollapsed) && (
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        What would you like AI to help you with?
                      </Label>
                  <Textarea
                        placeholder={`AI will help you with ${activeSection === 'experience' ? 'bullet points for your experience' : 
                          activeSection === 'education' ? 'achievements for your education' :
                          activeSection === 'skills' ? 'relevant skills for your position' :
                          activeSection === 'projects' ? 'project descriptions' :
                          activeSection === 'certifications' ? 'certification suggestions' :
                          'resume content'}. Just click "Generate with AI" to get started!`}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                        className="border-purple-200 focus:border-purple-500 resize-none"
                        rows={3}
                  />
                    </div>
                    <div className="flex space-x-2">
                  <Button
                    onClick={generateWithAI}
                        disabled={isGenerating}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                            <Wand2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAiPrompt("")}
                        disabled={isGenerating}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        Clear
                      </Button>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                      <p className="font-medium mb-1">💡 AI Tips:</p>
                      <ul className="space-y-1">
                        <li>• For Experience: Add company & position details first</li>
                        <li>• For Education: Add institution & degree details first</li>
                        <li>• For Skills: AI will suggest relevant skills for your position</li>
                        <li>• For Projects: Add project name first for better descriptions</li>
                        <li>• For Certifications: AI will suggest relevant certifications</li>
                      </ul>
                      <p className="mt-2 text-xs text-blue-600">
                        💡 Tip: Add your professional title in Personal Information for better AI suggestions!
                      </p>
                    </div>
                </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div
            className={`${showPreview ? 'xl:col-span-1' : 'lg:col-span-3'} transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0 translate-y-10"
            } ${isAIMode ? 'pt-4' : ''}`}
          >
            {/* Personal Information */}
            {activeSection === "personal" && (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                    <User className="w-7 h-7 mr-3 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <p className="text-slate-600 mt-2">Add your basic information and contact details.</p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={resume.personalInfo.name}
                        onChange={(e) => updatePersonalInfo("name", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                        Professional Title *
                      </Label>
                      <Input
                        id="title"
                        value={resume.personalInfo.title}
                        onChange={(e) => updatePersonalInfo("title", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={resume.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={resume.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-sm font-semibold text-slate-700">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={resume.personalInfo.location}
                        onChange={(e) => updatePersonalInfo("location", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="linkedin" className="text-sm font-semibold text-slate-700">
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedin"
                        value={resume.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="linkedin.com/in/johndoe"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="github" className="text-sm font-semibold text-slate-700">
                        GitHub Profile
                      </Label>
                      <Input
                        id="github"
                        value={resume.personalInfo.github}
                        onChange={(e) => updatePersonalInfo("github", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="github.com/johndoe"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="website" className="text-sm font-semibold text-slate-700">
                        Personal Website
                      </Label>
                      <Input
                        id="website"
                        value={resume.personalInfo.website}
                        onChange={(e) => updatePersonalInfo("website", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        placeholder="https://johndoe.com"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <Label htmlFor="about" className="text-sm font-semibold text-slate-700">
                        About Me
                      </Label>
                      <Textarea
                        id="about"
                        value={resume.personalInfo.about || ""}
                        onChange={(e) => updatePersonalInfo("about", e.target.value)}
                        className="border-slate-200 focus:border-blue-500 min-h-[120px] text-base resize-none"
                        placeholder="Write a brief professional summary about yourself, your career goals, and what makes you unique..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                      Work Experience
                    </CardTitle>
                    <Button
                      onClick={addExperience}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.experiences.map((experience, index) => (
                    <div key={experience.id} className="p-6 border border-slate-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Experience {index + 1}</h3>
                        <Button
                          onClick={() => removeExperience(experience.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Company Name *</Label>
                          <Input
                            value={experience.company}
                            onChange={(e) => updateExperience(experience.id, "company", e.target.value)}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="Google"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Position *</Label>
                          <Input
                            value={experience.position}
                            onChange={(e) => updateExperience(experience.id, "position", e.target.value)}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="Senior Software Engineer"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Duration *</Label>
                        <Input
                          value={experience.duration}
                          onChange={(e) => updateExperience(experience.id, "duration", e.target.value)}
                          className="border-slate-200 focus:border-blue-500"
                          placeholder="Jan 2020 - Present"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Key Achievements</Label>
                        {experience.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex items-center space-x-2">
                            <Input
                              value={bullet}
                              onChange={(e) => {
                                const newBullets = [...experience.bullets]
                                newBullets[bulletIndex] = e.target.value
                                updateExperience(experience.id, "bullets", newBullets)
                              }}
                              className="border-slate-200 focus:border-blue-500"
                              placeholder="Increased system performance by 40%"
                            />
                            <Button
                              onClick={() => {
                                const newBullets = experience.bullets.filter((_, i) => i !== bulletIndex)
                                updateExperience(experience.id, "bullets", newBullets)
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            const newBullets = [...experience.bullets, ""]
                            updateExperience(experience.id, "bullets", newBullets)
                          }}
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:border-blue-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Achievement
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {activeSection === "education" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                      <GraduationCap className="w-6 h-6 mr-3 text-blue-600" />
                      Education
                    </CardTitle>
                    <Button
                      onClick={addEducation}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.educations.map((education, index) => (
                    <div key={education.id} className="p-6 border border-slate-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Education {index + 1}</h3>
                        <Button
                          onClick={() => removeEducation(education.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Institution *</Label>
                          <Input
                            value={education.institution}
                            onChange={(e) => updateEducation(education.id, "institution", e.target.value)}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="University of Technology"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Degree *</Label>
                          <Input
                            value={education.degree}
                            onChange={(e) => updateEducation(education.id, "degree", e.target.value)}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="Bachelor of Science in Computer Science"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Duration *</Label>
                        <Input
                          value={education.duration}
                          onChange={(e) => updateEducation(education.id, "duration", e.target.value)}
                          className="border-slate-200 focus:border-blue-500"
                          placeholder="2018 - 2022"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Achievements & Activities</Label>
                        {education.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-center space-x-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const newAchievements = [...education.achievements]
                                newAchievements[achievementIndex] = e.target.value
                                updateEducation(education.id, "achievements", newAchievements)
                              }}
                              className="border-slate-200 focus:border-blue-500"
                              placeholder="Dean's List, GPA 3.8/4.0"
                            />
                            <Button
                              onClick={() => {
                                const newAchievements = education.achievements.filter((_, i) => i !== achievementIndex)
                                updateEducation(education.id, "achievements", newAchievements)
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            const newAchievements = [...education.achievements, ""]
                            updateEducation(education.id, "achievements", newAchievements)
                          }}
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:border-blue-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Achievement
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                    <Code className="w-6 h-6 mr-3 text-blue-600" />
                    Skills & Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Add Skill</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="skill-input"
                        placeholder="e.g., JavaScript, React, Node.js"
                        className="border-slate-200 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const value = e.currentTarget.value.trim()
                            if (value) {
                              addSkill(value)
                            e.currentTarget.value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById('skill-input') as HTMLInputElement
                          if (input && input.value.trim()) {
                            addSkill(input.value.trim())
                          input.value = ""
                          }
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Your Skills ({resume.skills.length})
                      </span>
                      {resume.skills.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!resume) return
                            setResume({ ...resume, skills: [] })
                            toast({
                              title: "Skills Cleared",
                              description: "All skills have been removed.",
                              variant: "default",
                            })
                          }}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[60px] border border-slate-200 rounded-lg p-3 bg-slate-50">
                    {resume.skills.map((skill, index) => (
                      <Badge
                        key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 text-sm hover:bg-blue-200 transition-colors cursor-pointer group border border-blue-200"
                        onClick={() => removeSkill(index)}
                      >
                        {skill}
                        <Trash2 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Badge>
                    ))}
                  {resume.skills.length === 0 && (
                        <p className="text-slate-400 text-sm italic">
                      No skills added yet. Add your technical skills, programming languages, and tools.
                    </p>
                  )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                      <Rocket className="w-6 h-6 mr-3 text-blue-600" />
                      Projects
                    </CardTitle>
                    <Button
                      onClick={() => {
                        if (!resume) return
                        const newProject = {
                          id: Date.now(),
                          name: "",
                          description: "",
                          technologies: [""],
                          link: "",
                        }
                        setResume({
                          ...resume,
                          projects: [...resume.projects, newProject],
                        })
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.projects.map((project, index) => (
                    <div key={project.id} className="p-6 border border-slate-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Project {index + 1}</h3>
                        <Button
                          onClick={() => {
                            if (!resume) return
                            setResume({
                              ...resume,
                              projects: resume.projects.filter((p) => p.id !== project.id),
                            })
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Project Name *</Label>
                          <Input
                            value={project.name}
                            onChange={(e) => {
                              if (!resume) return
                              const updatedProjects = resume.projects.map((p) =>
                                p.id === project.id ? { ...p, name: e.target.value } : p
                              )
                              setResume({ ...resume, projects: updatedProjects })
                            }}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="E-commerce Platform"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Project Link</Label>
                          <Input
                            value={project.link || ""}
                            onChange={(e) => {
                              if (!resume) return
                              const updatedProjects = resume.projects.map((p) =>
                                p.id === project.id ? { ...p, link: e.target.value } : p
                              )
                              setResume({ ...resume, projects: updatedProjects })
                            }}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Description *</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => {
                            if (!resume) return
                            const updatedProjects = resume.projects.map((p) =>
                              p.id === project.id ? { ...p, description: e.target.value } : p
                            )
                            setResume({ ...resume, projects: updatedProjects })
                          }}
                          className="border-slate-200 focus:border-blue-500 min-h-[100px]"
                          placeholder="Describe your project, its features, and your role..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Technologies Used</Label>
                        {project.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="flex items-center space-x-2">
                            <Input
                              value={tech}
                              onChange={(e) => {
                                if (!resume) return
                                const newTechnologies = [...project.technologies]
                                newTechnologies[techIndex] = e.target.value
                                const updatedProjects = resume.projects.map((p) =>
                                  p.id === project.id ? { ...p, technologies: newTechnologies } : p
                                )
                                setResume({ ...resume, projects: updatedProjects })
                              }}
                              className="border-slate-200 focus:border-blue-500"
                              placeholder="React, Node.js, MongoDB"
                            />
                            <Button
                              onClick={() => {
                                if (!resume) return
                                const newTechnologies = project.technologies.filter((_, i) => i !== techIndex)
                                const updatedProjects = resume.projects.map((p) =>
                                  p.id === project.id ? { ...p, technologies: newTechnologies } : p
                                )
                                setResume({ ...resume, projects: updatedProjects })
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            if (!resume) return
                            const newTechnologies = [...project.technologies, ""]
                            const updatedProjects = resume.projects.map((p) =>
                              p.id === project.id ? { ...p, technologies: newTechnologies } : p
                            )
                            setResume({ ...resume, projects: updatedProjects })
                          }}
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:border-blue-300"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Technology
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Certifications Section */}
            {activeSection === "certifications" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                      <Award className="w-6 h-6 mr-3 text-blue-600" />
                      Certifications
                    </CardTitle>
                    <Button
                      onClick={() => {
                        if (!resume) return
                        const newCertification = {
                          id: Date.now(),
                          name: "",
                          issuer: "",
                          date: "",
                        }
                        setResume({
                          ...resume,
                          certifications: [...resume.certifications, newCertification],
                        })
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resume.certifications.map((certification, index) => (
                    <div key={certification.id} className="p-6 border border-slate-200 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-900">Certification {index + 1}</h3>
                        <Button
                          onClick={() => {
                            if (!resume) return
                            setResume({
                              ...resume,
                              certifications: resume.certifications.filter((c) => c.id !== certification.id),
                            })
                          }}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Certification Name *</Label>
                          <Input
                            value={certification.name}
                            onChange={(e) => {
                              if (!resume) return
                              const updatedCertifications = resume.certifications.map((c) =>
                                c.id === certification.id ? { ...c, name: e.target.value } : c
                              )
                              setResume({ ...resume, certifications: updatedCertifications })
                            }}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="AWS Certified Solutions Architect"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700">Issuing Organization *</Label>
                          <Input
                            value={certification.issuer}
                            onChange={(e) => {
                              if (!resume) return
                              const updatedCertifications = resume.certifications.map((c) =>
                                c.id === certification.id ? { ...c, issuer: e.target.value } : c
                              )
                              setResume({ ...resume, certifications: updatedCertifications })
                            }}
                            className="border-slate-200 focus:border-blue-500"
                            placeholder="Amazon Web Services"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">Date Obtained *</Label>
                        <Input
                          value={certification.date}
                          onChange={(e) => {
                            if (!resume) return
                            const updatedCertifications = resume.certifications.map((c) =>
                              c.id === certification.id ? { ...c, date: e.target.value } : c
                            )
                            setResume({ ...resume, certifications: updatedCertifications })
                          }}
                          className="border-slate-200 focus:border-blue-500"
                          placeholder="December 2023"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-blue-600" />
                    Resume Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Resume Title</Label>
                      <Input
                        value={resume.title}
                        onChange={(e) => setResume({ ...resume, title: e.target.value })}
                        className="border-slate-200 focus:border-blue-500"
                        placeholder="My Professional Resume"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Template</Label>
                      <Select
                        value={resume.template || "professional"}
                        onValueChange={(value) => setResume({ ...resume, template: value })}
                      >
                        <SelectTrigger className="border-slate-200 focus:border-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional Classic</SelectItem>
                          <SelectItem value="modern">Modern Minimalist</SelectItem>
                          <SelectItem value="creative">Creative Portfolio</SelectItem>
                          <SelectItem value="executive">Executive Elite</SelectItem>
                          <SelectItem value="academic">Academic Scholar</SelectItem>
                          <SelectItem value="startup">Startup Innovator</SelectItem>
                          <SelectItem value="minimal">Minimal Clean</SelectItem>
                          <SelectItem value="tech">Tech Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div
              className={`xl:col-span-1 transition-all duration-1000 ${
                isVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0 translate-y-10"
              }`}
            >
              <Card className="border-2 border-blue-200 shadow-xl bg-white/95 backdrop-blur-sm sticky top-24">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Live Preview
                    <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Real-time</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white border border-slate-200 rounded-lg p-6 max-h-[800px] overflow-y-auto shadow-inner">
                    <ResumePreview resume={resume} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  )
}
