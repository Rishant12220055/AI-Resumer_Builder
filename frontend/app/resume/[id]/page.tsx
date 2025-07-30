"use client"

import { useState, useEffect, use } from "react"
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
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Calendar,
  Star,
  Edit3,
  Check,
} from "lucide-react"
import React from "react"
import { api, Resume } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"

export default function ResumeBuilder({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { user } = useAuth()
  const { toast } = useToast()
  const [resume, setResume] = useState<Resume | null>(null)
  const [activeSection, setActiveSection] = useState("personal")
  const [isAIMode, setIsAIMode] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newSkill, setNewSkill] = useState("")
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")
  // 1. Add state to track which project is being generated
  const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        console.log("Loading resume with ID:", id)
        console.log("User authenticated:", !!user)
        console.log("Auth token exists:", !!api.getToken())
        
        const fetchedResume = await api.getResume(id)
        console.log("Resume loaded successfully:", fetchedResume)
        setResume(fetchedResume)
      } catch (error: any) {
        console.error("Error loading resume:", error)
        console.error("Error status:", error.status)
        console.error("Error response:", error.response)
        
        if (error.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Please log in again to continue.",
            variant: "destructive",
          })
          router.push("/auth/login")
        } else if (error.status === 404) {
          toast({
            title: "Resume Not Found",
            description: "The requested resume could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard")
        } else {
          toast({
            title: "Error",
            description: "Failed to load resume. Please try again.",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } finally {
        setLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }

    console.log("useEffect triggered - user:", !!user, "id:", id, "loading:", loading)
    if (user && id) {
      loadResume()
    } else if (!user && !loading) {
      console.log("No user found after loading completed - user will be redirected by ProtectedRoute")
    }
  }, [id, user, router, toast, loading])

  // Auto-save functionality with status tracking
  useEffect(() => {
    if (!resume || loading) return

    // Mark as unsaved when resume data changes
    setSaveStatus("unsaved")

    const autoSaveTimer = setTimeout(async () => {
      try {
        setSaveStatus("saving")
        await api.updateResume(resume._id, resume)
        setSaveStatus("saved")
        console.log("Auto-saved resume")
      } catch (error) {
        setSaveStatus("unsaved")
        console.error("Auto-save failed:", error)
      }
    }, 1500) // Auto-save after 1.5 seconds of inactivity for faster updates

    return () => clearTimeout(autoSaveTimer)
  }, [resume, loading])

  const saveResume = async () => {
    if (!resume) return

    try {
      setSaveStatus("saving")
      await api.updateResume(resume._id, resume)
      setSaveStatus("saved")
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      })
    } catch (error: any) {
      setSaveStatus("unsaved")
      toast({
        title: "Error",
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      })
    }
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
      _id: Date.now().toString(),
      company: "",
      position: "",
      duration: "",
      bullets: [""],
    }
    setResume({
      ...resume,
      experiences: [...(resume.experiences || []), newExperience],
    })
  }

  const updateExperience = (expId: string, field: string, value: string | string[]) => {
    if (!resume) return
    setResume({
      ...resume,
      experiences: (resume.experiences || []).map((exp) => (exp._id === expId ? { ...exp, [field]: value } : exp)),
    })
  }

  const removeExperience = (expId: string) => {
    if (!resume) return
    setResume({
      ...resume,
      experiences: (resume.experiences || []).filter((exp) => exp._id !== expId),
    })
  }

  const addEducation = () => {
    if (!resume) return
    const newEducation = {
      _id: Date.now().toString(),
      institution: "",
      degree: "",
      duration: "",
      achievements: [""],
    }
    setResume({
      ...resume,
      educations: [...(resume.educations || []), newEducation],
    })
  }

  const updateEducation = (eduId: string, field: string, value: string | string[]) => {
    if (!resume) return
    setResume({
      ...resume,
      educations: (resume.educations || []).map((edu) => (edu._id === eduId ? { ...edu, [field]: value } : edu)),
    })
  }

  const removeEducation = (eduId: string) => {
    if (!resume) return
    setResume({
      ...resume,
      educations: (resume.educations || []).filter((edu) => edu._id !== eduId),
    })
  }

  const addSkill = () => {
    if (!resume || !newSkill.trim()) return
    const newSkillObj = {
      _id: Date.now().toString(),
      name: newSkill.trim(),
      level: "Intermediate"
    }
    setResume({
      ...resume,
      skills: [...(resume.skills || []), newSkillObj],
    })
    setNewSkill("")
  }

  const removeSkill = (skillId: string) => {
    if (!resume) return
    setResume({
      ...resume,
      skills: (resume.skills || []).filter((skill) => skill._id !== skillId),
    })
  }

  const addProject = () => {
    if (!resume) return
    const newProject = {
      _id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    }
    setResume({
      ...resume,
      projects: [...(resume.projects || []), newProject],
    })
  }

  const updateProject = (projectId: string, field: string, value: string | string[]) => {
    if (!resume) return
    setResume({
      ...resume,
      projects: (resume.projects || []).map((project) => (project._id === projectId ? { ...project, [field]: value } : project)),
    })
  }

  const removeProject = (projectId: string) => {
    if (!resume) return
    setResume({
      ...resume,
      projects: (resume.projects || []).filter((project) => project._id !== projectId),
    })
  }

  const addCertification = () => {
    if (!resume) return
    const newCertification = {
      _id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      link: "",
    }
    setResume({
      ...resume,
      certifications: [...(resume.certifications || []), newCertification],
    })
  }

  const updateCertification = (certId: string, field: string, value: string) => {
    if (!resume) return
    setResume({
      ...resume,
      certifications: (resume.certifications || []).map((cert) => (cert._id === certId ? { ...cert, [field]: value } : cert)),
    })
  }

  const removeCertification = (certId: string) => {
    if (!resume) return
    setResume({
      ...resume,
      certifications: (resume.certifications || []).filter((cert) => cert._id !== certId),
    })
  }

  const generateWithAI = async (context: string, data: any, retries = 0) => {
    setIsGenerating(true)
    if (retries > 0) {
      setIsRetrying(true)
      setRetryCount(retries)
    }
    
    try {
      const response = await api.getAISuggestions({ context, ...data })
      toast({
        title: "AI Suggestions Generated",
        description: "Check the suggestions below and click to apply them.",
      })
      return response
    } catch (error: any) {
      // Check if error is retryable (busy/overloaded service)
      const isRetryable = error.isRetryable || 
                         error.message.includes('overloaded') || 
                         error.message.includes('busy') || 
                         error.message.includes('rate limit') ||
                         error.status === 429 || 
                         error.status === 503
      
      // Only log error details for non-retryable errors or final retry
      if (!isRetryable || retries >= 3) {
        console.error("AI generation error:", error)
      }
      
      // Handle retryable errors with retry logic
      if (isRetryable && retries < 3) {
        const waitTime = Math.min(2000 + (retries * 2000), 10000) // 2s, 4s, 6s max
        
        // Only show toast for first retry to avoid spam
        if (retries === 0) {
          toast({
            title: "AI Service Busy",
            description: `Retrying automatically... The AI service is handling high demand.`,
          })
        }
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return generateWithAI(context, data, retries + 1)
      }
      
      // Determine appropriate error message for non-retryable or exhausted retries
      let errorMessage = "Failed to generate AI suggestions. Please try again."
      if (isRetryable) {
        errorMessage = "AI service is currently overloaded. Please try again in a few minutes."
      } else if (error.message.includes('Network error')) {
        errorMessage = "Network connection issue. Please check your internet and try again."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "AI Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
      return null
    } finally {
      setIsGenerating(false)
      setIsRetrying(false)
      setRetryCount(0)
    }
  }

  const generateExperienceBullets = async (experience: any) => {
    if (!experience.company || !experience.position) {
      toast({
        title: "Missing Information",
        description: "Please fill in both company and position before generating bullets.",
        variant: "destructive",
      })
      return
    }

    try {
      const suggestions = await generateWithAI('resume_bullet_point', {
        company: experience.company,
        position: experience.position,
        duration: experience.duration
      })

      if (suggestions && suggestions.suggestions && suggestions.suggestions.length > 0) {
        // Update the experience with AI-generated bullets
        updateExperience(safeId(experience._id), "bullets", suggestions.suggestions)
      } else if (suggestions === null) {
        // AI generation failed, don't show additional error
        return
      } else {
        toast({
          title: "No Suggestions Generated",
          description: "Unable to generate bullet points with the provided information.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error in generateExperienceBullets:", error)
      // Error is already handled by generateWithAI, this is just a safety net
    }
  }

  const generateEducationAchievements = async (education: any) => {
    if (!education.institution || !education.degree) {
      toast({
        title: "Missing Information",
        description: "Please fill in both institution and degree before generating achievements.",
        variant: "destructive",
      })
      return
    }

    try {
      const suggestions = await generateWithAI('education_achievement', {
        institution: education.institution,
        degree: education.degree,
        duration: education.duration
      })

      if (suggestions && suggestions.suggestions && suggestions.suggestions.length > 0) {
        // Update the education with AI-generated achievements
        updateEducation(education._id, "achievements", suggestions.suggestions)
      } else if (suggestions === null) {
        // AI generation failed, don't show additional error
        return
      } else {
        toast({
          title: "No Achievements Generated",
          description: "Unable to generate achievements with the provided information.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error in generateEducationAchievements:", error)
      // Error is already handled by generateWithAI, this is just a safety net
    }
  }

  // Add new function to generate key achievements for all experiences
  const generateAllExperienceBullets = async () => {
    if (!resume || !resume.experiences || resume.experiences.length === 0) {
      toast({
        title: "No Experiences",
        description: "Please add at least one experience before generating achievements.",
        variant: "destructive",
      })
      return
    }
    
    try {
      let updatedCount = 0;
      for (const experience of resume.experiences) {
        if (experience.company && experience.position) {
          const suggestions = await generateWithAI('resume_bullet_point', {
            company: experience.company,
            position: experience.position,
            duration: experience.duration
          })
          if (suggestions && suggestions.suggestions && suggestions.suggestions.length > 0) {
            updateExperience(safeId(experience._id), "bullets", suggestions.suggestions)
            updatedCount++;
            toast({
              title: `Achievements Generated`,
              description: `Generated achievements for ${experience.position} at ${experience.company}`,
            })
          }
        }
      }
      if (updatedCount === 0) {
        toast({
          title: "No Experiences Updated",
          description: "Please fill in company and position for each experience.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Key Achievements Generated",
          description: `Updated ${updatedCount} experience${updatedCount > 1 ? 's' : ''} with AI-powered achievements.`,
        })
      }
    } catch (error: any) {
      console.error("Error in generateAllExperienceBullets:", error)
      // Error is already handled by generateWithAI, this is just a safety net
    }
  }

  // 2. Update generateProjectDescription to set/reset generatingProjectId
  const generateProjectDescription = async (project: any) => {
    if (!project.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in the project name before generating description.",
        variant: "destructive",
      })
      return
    }
    
    try {
      setGeneratingProjectId(project._id);
      const suggestions = await generateWithAI('project_description', {
        projectName: project.name,
        position: resume?.experiences?.[0]?.position || "Software Engineer"
      })
      if (suggestions && suggestions.suggestions && suggestions.suggestions.length > 0) {
        updateProject(safeId(project._id), "description", suggestions.suggestions[0])
      } else if (suggestions === null) {
        // AI generation failed, don't show additional error
        return
      } else {
        toast({
          title: "No Description Generated",
          description: "Unable to generate project description with the provided information.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error in generateProjectDescription:", error)
      // Error is already handled by generateWithAI, this is just a safety net
    } finally {
      setGeneratingProjectId(null);
    }
  }

  const generatePersonalSummary = async () => {
    if (!resume?.personalInfo?.firstName) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and current position to generate a summary.",
        variant: "destructive",
      })
      return
    }

    try {
      const suggestions = await generateWithAI('about_me_description', {
        name: `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`,
        position: "Professional" // Generic position for AI context
      })

      if (suggestions && suggestions.suggestions && suggestions.suggestions.length > 0) {
        // Update the personal info with AI-generated summary
        updatePersonalInfo("summary", suggestions.suggestions[0])
        toast({
          title: "Summary Generated",
          description: "AI has generated a professional summary for you.",
        })
      } else if (suggestions === null) {
        // AI generation failed, error already shown by generateWithAI
        return
      } else {
        toast({
          title: "No Summary Generated",
          description: "Unable to generate summary with the provided information.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Personal summary generation error:", error)
      toast({
        title: "Summary Generation Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getTemplateInfo = (templateId?: string) => {
    const templates: Record<string, { name: string; color: string; icon: any }> = {
      professional: { name: "Professional", color: "bg-violet-500", icon: FileText },
      modern: { name: "Modern", color: "bg-cyan-500", icon: Sparkles },
      creative: { name: "Creative", color: "bg-amber-500", icon: Palette },
      executive: { name: "Executive", color: "bg-gray-700", icon: Crown },
      academic: { name: "Academic", color: "bg-emerald-500", icon: Target },
      startup: { name: "Startup", color: "bg-red-500", icon: Zap },
      minimal: { name: "Minimal", color: "bg-gray-500", icon: FileText },
      tech: { name: "Tech", color: "bg-purple-500", icon: Rocket },
    }
    return templates[templateId || "professional"] || templates.professional
  }

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "skills", name: "Skills", icon: Code },
    { id: "projects", name: "Projects", icon: Rocket },
    { id: "certifications", name: "Certifications", icon: Award },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Resume not found</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                {/* Save Status Indicator */}
                <div className="flex items-center space-x-2">
                  {saveStatus === "saving" && (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-600">Saving...</span>
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-green-600">Saved</span>
                    </>
                  )}
                  {saveStatus === "unsaved" && (
                    <>
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-orange-600">Unsaved changes</span>
                    </>
                  )}
                </div>
                
                <Button onClick={saveResume} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Link href={`/resume/${id}/preview`}>
                  <Button variant="outline" className="border-slate-200 hover:border-blue-300">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content */}
          <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">Sections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            activeSection === section.id
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.name}</span>
                        </button>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-900">Resume Editor</CardTitle>
                    <p className="text-slate-600">Editing: {resume.title}</p>
                    
                    {/* AI Service Info Banner */}
                    <div className={`mt-4 p-3 border rounded-lg transition-all duration-300 ${
                      isRetrying 
                        ? "bg-orange-50 border-orange-200" 
                        : "bg-blue-50 border-blue-200"
                    }`}>
                      <div className="flex items-center space-x-2">
                        {isRetrying ? (
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          isRetrying ? "text-orange-900" : "text-blue-900"
                        }`}>
                          {isRetrying ? `AI Assistant (Retrying... ${retryCount}/3)` : "AI Assistant"}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        isRetrying ? "text-orange-700" : "text-blue-700"
                      }`}>
                        {isRetrying 
                          ? "AI service is busy. Automatically retrying to ensure your request is processed."
                          : "AI suggestions help improve your resume. If busy, we'll automatically retry up to 3 times."
                        }
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Personal Information */}
                    {activeSection === "personal" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                          </div>
                          <Button 
                            onClick={generatePersonalSummary}
                            disabled={isGenerating}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          >
                            {isGenerating ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                              <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate Summary
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={resume.personalInfo?.firstName || ""}
                              onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={resume.personalInfo?.lastName || ""}
                              onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                              placeholder="Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={resume.personalInfo?.email || ""}
                              onChange={(e) => updatePersonalInfo("email", e.target.value)}
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={resume.personalInfo?.phone || ""}
                              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              value={resume.personalInfo?.address || ""}
                              onChange={(e) => updatePersonalInfo("address", e.target.value)}
                              placeholder="San Francisco, CA"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={resume.personalInfo?.website || ""}
                              onChange={(e) => updatePersonalInfo("website", e.target.value)}
                              placeholder="https://johndoe.com"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="summary">Professional Summary</Label>
                          <Textarea
                            id="summary"
                            value={resume.personalInfo?.summary || ""}
                            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                            placeholder="Experienced software engineer with 5+ years of expertise in..."
                            rows={4}
                          />
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {activeSection === "experience" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Work Experience</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              onClick={generateAllExperienceBullets}
                              disabled={isGenerating}
                              size="sm" 
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            >
                              {isGenerating ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                              )}
                              Generate Key Achievements
                            </Button>
                            <Button onClick={addExperience} size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Experience
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {(resume.experiences || []).map((experience, index) => (
                            <Card key={experience._id} className="border border-slate-200">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-semibold text-slate-900">Experience {index + 1}</h4>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => generateExperienceBullets(experience)}
                                      disabled={isGenerating}
                                      size="sm"
                                      variant="outline"
                                      className="border-green-200 text-green-700 hover:bg-green-50"
                                    >
                                      {isGenerating ? (
                                        <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                                      ) : (
                                        <Sparkles className="w-4 h-4 mr-2" />
                                      )}
                                      Generate Bullets
                                    </Button>
                                    <Button
                                      onClick={() => removeExperience(safeId(experience._id))}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input
                                      value={experience.company || ""}
                                      onChange={(e) => updateExperience(experience._id || "", "company", e.target.value)}
                                      placeholder="Company Name"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input
                                      value={experience.position || ""}
                                      onChange={(e) => updateExperience(safeId(experience._id), "position", e.target.value)}
                                      placeholder="Senior Software Engineer"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Input
                                      value={experience.duration || ""}
                                      onChange={(e) => updateExperience(safeId(experience._id), "duration", e.target.value)}
                                      placeholder="Jan 2022 - Present"
                                    />
                                  </div>

                                </div>

                                <div className="space-y-2">
                                  <Label>Key Achievements</Label>
                                  {(experience.bullets || []).map((bullet, bulletIndex) => (
                                    <div key={bulletIndex} className="flex items-center space-x-2">
                                      <Input
                                        value={bullet || ""}
                                        onChange={(e) => {
                                          const newBullets = [...(experience.bullets || [])]
                                          newBullets[bulletIndex] = e.target.value
                                          updateExperience(safeId(experience._id), "bullets", newBullets)
                                        }}
                                        placeholder="Led development of key feature..."
                                      />
                                      <Button
                                        onClick={() => {
                                          const newBullets = (experience.bullets || []).filter((_, i) => i !== bulletIndex)
                                          updateExperience(safeId(experience._id), "bullets", newBullets)
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    onClick={() => {
                                      const newBullets = [...(experience.bullets || []), ""]
                                      updateExperience(safeId(experience._id), "bullets", newBullets)
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Achievement
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {activeSection === "education" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Education</h3>
                          </div>
                          <Button onClick={addEducation} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Education
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {(resume.educations || []).map((education, index) => (
                            <Card key={education._id} className="border border-slate-200">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-semibold text-slate-900">Education {index + 1}</h4>
                                  <Button
                                    onClick={() => removeEducation(safeId(education._id))}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label>Institution</Label>
                                    <Input
                                      value={education.institution || ""}
                                      onChange={(e) => updateEducation(safeId(education._id), "institution", e.target.value)}
                                      placeholder="University of California"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Degree</Label>
                                    <Input
                                      value={education.degree || ""}
                                      onChange={(e) => updateEducation(safeId(education._id), "degree", e.target.value)}
                                      placeholder="Bachelor of Science in Computer Science"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Input
                                      value={education.duration || ""}
                                      onChange={(e) => updateEducation(safeId(education._id), "duration", e.target.value)}
                                      placeholder="2018 - 2022"
                                    />
                                  </div>

                                </div>

                                <div className="space-y-2">
                                  <Label>Achievements</Label>
                                  {(education.achievements || []).map((achievement, achievementIndex) => (
                                    <div key={achievementIndex} className="flex items-center space-x-2">
                                      <Input
                                        value={achievement || ""}
                                        onChange={(e) => {
                                          const newAchievements = [...(education.achievements || [])]
                                          newAchievements[achievementIndex] = e.target.value
                                          updateEducation(safeId(education._id), "achievements", newAchievements)
                                        }}
                                        placeholder="GPA: 3.8/4.0..."
                                      />
                                      <Button
                                        onClick={() => {
                                          const newAchievements = (education.achievements || []).filter((_, i) => i !== achievementIndex)
                                          updateEducation(safeId(education._id), "achievements", newAchievements)
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    onClick={() => {
                                      const newAchievements = [...(education.achievements || []), ""]
                                      updateEducation(safeId(education._id), "achievements", newAchievements)
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Achievement
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {activeSection === "skills" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Code className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
                          </div>
                          <Button 
                            onClick={generateSkills}
                            disabled={isGenerating}
                            size="sm"
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                          >
                            {isGenerating ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                              <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate Skills
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a new skill..."
                              onKeyPress={(e) => e.key === "Enter" && addSkill()}
                            />
                            <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(resume.skills || []).map((skill) => (
                              <Badge
                                key={skill._id}
                                variant="secondary"
                                className="flex items-center space-x-2 px-3 py-1"
                              >
                                <span>{skill.name}</span>
                                <button
                                  onClick={() => removeSkill(safeId(skill._id))}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {activeSection === "projects" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Rocket className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
                          </div>
                          <Button onClick={addProject} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Project
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {(resume.projects || []).map((project, index) => (
                            <Card key={project._id} className="border border-slate-200">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-semibold text-slate-900">Project {index + 1}</h4>
                                  <Button
                                    onClick={() => removeProject(safeId(project._id))}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    <Input
                                      value={project.name || ""}
                                      onChange={(e) => updateProject(safeId(project._id), "name", e.target.value)}
                                      placeholder="E-commerce Platform"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Project Link</Label>
                                    <Input
                                      value={project.link || ""}
                                      onChange={(e) => updateProject(safeId(project._id), "link", e.target.value)}
                                      placeholder="https://github.com/username/project"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <Label>Description</Label>
                                  <div className="flex items-center gap-2">
                                    <Textarea
                                      value={project.description || ""}
                                      onChange={(e) => updateProject(safeId(project._id), "description", e.target.value)}
                                      placeholder="A full-stack e-commerce platform built with React and Node.js..."
                                      rows={3}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => generateProjectDescription(project)}
                                      disabled={generatingProjectId === project._id}
                                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white h-10 px-2"
                                      style={{ minWidth: 40 }}
                                    >
                                      {generatingProjectId === project._id ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Sparkles className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Technologies Used</Label>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Button
                                      onClick={() => generateProjectTechnologies(project)}
                                      disabled={generatingProjectId === project._id}
                                      size="sm"
                                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                    >
                                      {generatingProjectId === project._id ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                      ) : (
                                        <Sparkles className="w-3 h-3 mr-1" />
                                      )}
                                      Generate Tech Stack
                                    </Button>
                                  </div>
                                  {safeTechnologies(project.technologies).map((tech: string, techIndex: number) => (
                                    <div key={techIndex} className="flex items-center space-x-2">
                                      <Input
                                        value={tech || ""}
                                        onChange={(e) => {
                                          const newTechs = [...safeTechnologies(project.technologies)]
                                          newTechs[techIndex] = e.target.value
                                          updateProject(safeId(project._id), "technologies", newTechs)
                                        }}
                                        placeholder="React, Node.js, MongoDB..."
                                      />
                                      <Button
                                        onClick={() => {
                                          const newTechs = safeTechnologies(project.technologies).filter((_: string, i: number) => i !== techIndex)
                                          updateProject(safeId(project._id), "technologies", newTechs)
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    onClick={() => {
                                      const newTechs = [...safeTechnologies(project.technologies), ""]
                                      updateProject(safeId(project._id), "technologies", newTechs)
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Technology
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {activeSection === "certifications" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Certifications</h3>
                          </div>
                          <Button onClick={addCertification} size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Certification
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {(resume.certifications || []).map((certification, index) => (
                            <Card key={certification._id} className="border border-slate-200">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-4">
                                  <h4 className="font-semibold text-slate-900">Certification {index + 1}</h4>
                                  <Button
                                    onClick={() => removeCertification(safeId(certification._id))}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Certification Name</Label>
                                    <Input
                                      value={certification.name}
                                      onChange={(e) => updateCertification(safeId(certification._id), "name", e.target.value)}
                                      placeholder="AWS Certified Solutions Architect"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Issuing Organization</Label>
                                    <Input
                                      value={certification.issuer}
                                      onChange={(e) => updateCertification(safeId(certification._id), "issuer", e.target.value)}
                                      placeholder="Amazon Web Services"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Date Earned</Label>
                                    <Input
                                      value={certification.date}
                                      onChange={(e) => updateCertification(safeId(certification._id), "date", e.target.value)}
                                      placeholder="December 2023"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Verification Link</Label>
                                    <Input
                                      value={certification.link}
                                      onChange={(e) => updateCertification(safeId(certification._id), "link", e.target.value)}
                                      placeholder="https://aws.amazon.com/verification"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Helper functions for type safety
const safeId = (id: string | undefined): string => id || "";

const safeTechnologies = (technologies: string | string[]): string[] => {
  return Array.isArray(technologies) ? technologies : [];
};

// Placeholder for missing generateSkills function
const generateSkills = () => {
  console.log("generateSkills function is not implemented yet.");
};

const generateProjectTechnologies = (project: any) => {
  console.log("generateProjectTechnologies function is not implemented yet.", project);
};