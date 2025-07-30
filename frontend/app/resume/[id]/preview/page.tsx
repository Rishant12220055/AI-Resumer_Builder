"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  Eye,
  EyeOff,
  Palette,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Code,
  ExternalLink,
} from "lucide-react"
import React from "react"
import { api, Resume } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"

const templateStyles = {
  professional: {
    name: "Professional Classic",
    primaryColor: "#7c3aed",
    secondaryColor: "#a855f7",
    accentColor: "#c084fc",
    fontFamily: "font-serif",
    headerBg: "bg-violet-600",
    sectionBg: "bg-gray-50",
  },
  modern: {
    name: "Modern Minimalist",
    primaryColor: "#06b6d4",
    secondaryColor: "#0891b2",
    accentColor: "#67e8f9",
    fontFamily: "font-sans",
    headerBg: "bg-cyan-600",
    sectionBg: "bg-slate-50",
  },
  creative: {
    name: "Creative Portfolio",
    primaryColor: "#f59e0b",
    secondaryColor: "#f97316",
    accentColor: "#fbbf24",
    fontFamily: "font-sans",
    headerBg: "bg-amber-500",
    sectionBg: "bg-orange-50",
  },
  executive: {
    name: "Executive Elite",
    primaryColor: "#1f2937",
    secondaryColor: "#374151",
    accentColor: "#6b7280",
    fontFamily: "font-serif",
    headerBg: "bg-gray-800",
    sectionBg: "bg-gray-100",
  },
}

export default function ResumePreview({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use<{ id: string }>(params)
  const { user } = useAuth()
  const { toast } = useToast()
  const [resume, setResume] = useState<Resume | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showPersonalInfo, setShowPersonalInfo] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false) // Add state for auto-refresh toggle

  useEffect(() => {
    const loadResume = async () => {
      try {
        const fetchedResume = await api.getResume(id)
        setResume(fetchedResume)
        setSelectedTemplate(fetchedResume.template || "professional")
      } catch (error: any) {
        console.error("Error loading resume:", error)
        toast({
          title: "Error",
          description: "Failed to load resume. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }

    if (user && id) {
      loadResume()
    }
  }, [id, user, router, toast])

  // Real-time updates - refresh data every 10 seconds (increased from 3 seconds)
  useEffect(() => {
    if (!user || !id || !autoRefresh) return

    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true)
        const fetchedResume = await api.getResume(id)
        setResume(fetchedResume)
      } catch (error) {
        console.error("Error refreshing resume:", error)
      } finally {
        setIsRefreshing(false)
      }
    }, 10000) // Refresh every 10 seconds instead of 3

    return () => clearInterval(interval)
  }, [id, user, autoRefresh])

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement("a")
    link.href = "#"
    const fullName = resume?.personalInfo?.firstName && resume?.personalInfo?.lastName 
      ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`
      : "Resume"
    link.download = `${fullName}.pdf`
    link.click()
    toast({
      title: "Download Started",
      description: "Your resume is being prepared for download.",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      const fullName = resume?.personalInfo?.firstName && resume?.personalInfo?.lastName 
        ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`
        : "User"
      navigator.share({
        title: `${fullName}'s Resume`,
        text: "Check out my professional resume",
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Resume link copied to clipboard!",
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const adjustZoom = (direction: "in" | "out" | "reset") => {
    if (direction === "in" && zoomLevel < 150) {
      setZoomLevel(zoomLevel + 10)
    } else if (direction === "out" && zoomLevel > 50) {
      setZoomLevel(zoomLevel - 10)
    } else if (direction === "reset") {
      setZoomLevel(100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-violet-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-violet-100 rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Resume not found</p>
        </div>
      </div>
    )
  }

  const currentStyle = templateStyles[selectedTemplate as keyof typeof templateStyles]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/50">
        {/* Header */}
        {!isFullscreen && (
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-violet-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/resume/${id}`}
                    className="flex items-center space-x-2 text-slate-600 hover:text-violet-600 transition-colors group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Editor</span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-lg font-bold text-slate-900">Live Preview</span>
                      <Badge className="ml-2 bg-violet-100 text-violet-700 text-xs">{currentStyle.name}</Badge>
                      {isRefreshing && (
                        <Badge className="ml-2 bg-green-100 text-green-700 text-xs animate-pulse">
                          Updating...
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                                  <div className="flex items-center space-x-4">
                    {/* Auto-refresh Toggle */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={autoRefresh}
                        onCheckedChange={setAutoRefresh}
                        className="data-[state=checked]:bg-violet-600"
                      />
                      <Label className="text-sm text-slate-600">Auto-refresh</Label>
                    </div>
                    
                    {/* Refresh Button */}
                    <Button
                      onClick={async () => {
                        try {
                          setIsRefreshing(true)
                          const fetchedResume = await api.getResume(id)
                          setResume(fetchedResume)
                          toast({
                            title: "Preview Updated",
                            description: "Resume preview refreshed with latest changes.",
                          })
                        } catch (error) {
                          toast({
                            title: "Refresh Failed",
                            description: "Failed to refresh preview. Please try again.",
                            variant: "destructive",
                          })
                        } finally {
                          setIsRefreshing(false)
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="border-violet-200 hover:border-violet-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>

                    {/* Template Selector */}
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="w-48 border-violet-200 focus:border-violet-500">
                        <Palette className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional Classic</SelectItem>
                        <SelectItem value="modern">Modern Minimalist</SelectItem>
                        <SelectItem value="creative">Creative Portfolio</SelectItem>
                        <SelectItem value="executive">Executive Elite</SelectItem>
                      </SelectContent>
                    </Select>

                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-violet-200/50">
                    <Button
                      onClick={() => adjustZoom("out")}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-violet-100"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium text-slate-600 min-w-[3rem] text-center">{zoomLevel}%</span>
                    <Button
                      onClick={() => adjustZoom("in")}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-violet-100"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => adjustZoom("reset")}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-violet-100"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleDownload} variant="outline" className="border-violet-200 hover:border-violet-300">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="border-violet-200 hover:border-violet-300">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button onClick={handlePrint} variant="outline" className="border-violet-200 hover:border-violet-300">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      variant="outline"
                      className="border-violet-200 hover:border-violet-300"
                    >
                      {isFullscreen ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {isFullscreen ? "Exit" : "Fullscreen"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Resume Preview */}
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
              className="bg-white shadow-2xl rounded-2xl overflow-hidden mx-auto"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                maxWidth: "800px",
                minHeight: "1100px",
              }}
            >
              {/* Resume Content */}
              <div className={`${currentStyle.fontFamily} text-slate-900`}>
                {/* Header */}
                <div className={`${currentStyle.headerBg} text-white p-8`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold mb-2">
                        {resume.personalInfo?.firstName && resume.personalInfo?.lastName 
                          ? `${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`
                          : "Your Name"}
                      </h1>
                      <p className="text-xl opacity-90 mb-4">Professional Title</p>
                      <p className="text-sm opacity-80 max-w-md">{resume.personalInfo?.summary || "Professional summary goes here..."}</p>
                    </div>
                    <div className="text-right space-y-1">
                      {resume.personalInfo?.email && (
                        <div className="flex items-center justify-end space-x-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{resume.personalInfo.email}</span>
                        </div>
                      )}
                      {resume.personalInfo?.phone && (
                        <div className="flex items-center justify-end space-x-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{resume.personalInfo.phone}</span>
                        </div>
                      )}
                      {resume.personalInfo?.address && (
                        <div className="flex items-center justify-end space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{resume.personalInfo.address}</span>
                        </div>
                      )}
                      {resume.personalInfo?.website && (
                        <div className="flex items-center justify-end space-x-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">{resume.personalInfo.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="p-8 space-y-8">
                  {/* Experience */}
                  {(resume.experiences || []).length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Building className="w-6 h-6 mr-3 text-violet-600" />
                        Professional Experience
                      </h2>
                      <div className="space-y-6">
                        {(resume.experiences || []).map((experience, index) => (
                          <div key={experience._id || index} className="border-l-4 border-violet-200 pl-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold">{experience.position}</h3>
                              <span className="text-sm text-slate-500">{experience.duration}</span>
                            </div>
                                                         <p className="text-violet-600 font-medium mb-2">{experience.company}</p>
                            <ul className="space-y-1">
                              {(experience.bullets || []).map((bullet, bulletIndex) => (
                                <li key={bulletIndex} className="text-sm text-slate-700 flex items-start">
                                  <span className="text-violet-500 mr-2">•</span>
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {(resume.educations || []).length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <GraduationCap className="w-6 h-6 mr-3 text-violet-600" />
                        Education
                      </h2>
                      <div className="space-y-6">
                        {(resume.educations || []).map((education, index) => (
                          <div key={education._id || index} className="border-l-4 border-violet-200 pl-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold">{education.degree}</h3>
                              <span className="text-sm text-slate-500">{education.duration}</span>
                            </div>
                                                         <p className="text-violet-600 font-medium mb-2">{education.institution}</p>
                            {(education.achievements || []).length > 0 && (
                              <ul className="space-y-1">
                                {(education.achievements || []).map((achievement, achievementIndex) => (
                                  <li key={achievementIndex} className="text-sm text-slate-700 flex items-start">
                                    <span className="text-violet-500 mr-2">•</span>
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Skills */}
                  {(resume.skills || []).length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Code className="w-6 h-6 mr-3 text-violet-600" />
                        Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {(resume.skills || []).map((skill, index) => (
                          <Badge
                            key={skill._id || index}
                            variant="secondary"
                            className="bg-violet-100 text-violet-700 hover:bg-violet-200"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {(resume.projects || []).length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Award className="w-6 h-6 mr-3 text-violet-600" />
                        Projects
                      </h2>
                      <div className="space-y-6">
                        {(resume.projects || []).map((project, index) => (
                          <div key={project._id || index} className="border-l-4 border-violet-200 pl-6">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold">{project.name}</h3>
                              {project.link && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-violet-600 hover:text-violet-700 flex items-center space-x-1"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="text-sm">View</span>
                                </a>
                              )}
                            </div>
                            <p className="text-slate-700 mb-3">{project.description}</p>
                                                         {project.technologies && (
                               <div className="flex flex-wrap gap-1">
                                 {project.technologies.split(',').map((tech, techIndex) => (
                                   <Badge key={techIndex} variant="outline" className="text-xs">
                                     {tech.trim()}
                                   </Badge>
                                 ))}
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Certifications */}
                  {(resume.certifications || []).length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Award className="w-6 h-6 mr-3 text-violet-600" />
                        Certifications
                      </h2>
                      <div className="space-y-4">
                        {(resume.certifications || []).map((certification, index) => (
                          <div key={certification._id || index} className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{certification.name}</h3>
                              <p className="text-sm text-slate-600">{certification.issuer}</p>
                            </div>
                            <span className="text-sm text-slate-500">{certification.date}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
