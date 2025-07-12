"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Rocket,
  Plus,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download,
  Clock,
  FileText,
  Sparkles,
  Target,
  Zap,
  Crown,
  Palette,
  LogOut,
  User,
  Settings,
  Building,
  Code,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import ProtectedRoute from "@/components/protected-route"

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

export default function Dashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Load resumes from localStorage
    const savedResumes = localStorage.getItem("resumes")
    if (savedResumes) {
      try {
        const parsedResumes = JSON.parse(savedResumes)
        setResumes(parsedResumes)
      } catch (error) {
        console.error("Error parsing resumes:", error)
        setResumes([])
      }
    }

    // Trigger animations
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateResume = () => {
    console.log("Create New Resume button clicked")
    console.log("Current router:", router)
    try {
      router.push("/templates")
      console.log("Navigation initiated to /templates")
    } catch (error) {
      console.error("Navigation error:", error)
    }
  }

  const handleEditResume = (resumeId: number) => {
    router.push(`/resume/${resumeId}`)
  }

  const handleDuplicateResume = (resume: Resume) => {
    const duplicatedResume = {
      ...resume,
      id: Date.now(),
      title: `${resume.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedResumes = [...resumes, duplicatedResume]
    setResumes(updatedResumes)
    localStorage.setItem("resumes", JSON.stringify(updatedResumes))
    
    toast({
      title: "Resume Duplicated",
      description: "Your resume has been successfully duplicated.",
    })
  }

  const handleDeleteResume = (resumeId: number) => {
    const updatedResumes = resumes.filter((resume) => resume.id !== resumeId)
    setResumes(updatedResumes)
    localStorage.setItem("resumes", JSON.stringify(updatedResumes))
    
    toast({
      title: "Resume Deleted",
      description: "Your resume has been successfully deleted.",
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-all duration-300">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ResumeAI
                  </span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-slate-100 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="font-medium text-slate-700">{user?.name || 'User'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <Link href="/profile">
                      <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        <span>Profile & Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="flex items-center space-x-2 text-red-600 cursor-pointer hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-slate-600 mt-2">
                  Ready to create your next professional resume? Choose a template and get started.
                </p>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  console.log("Button clicked directly")
                  handleCreateResume()
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Create New Resume
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div
            className={`mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-300 hover:border-blue-300 bg-white"}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-300 hover:border-blue-300 bg-white"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resumes Grid/List */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            {filteredResumes.length === 0 ? (
              <Card className="text-center py-16 border-slate-200/60 bg-white/80 backdrop-blur-sm">
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">No resumes yet</h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Create your first professional resume to get started. Choose from our collection of beautiful templates.
                  </p>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      console.log("Empty state button clicked directly")
                      handleCreateResume()
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
                  >
                    <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Create Your First Resume
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredResumes.map((resume) => {
                  const templateInfo = getTemplateInfo(resume.template)
                  return (
                    <Card
                      key={resume.id}
                      className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm cursor-pointer"
                      onClick={() => handleEditResume(resume.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 ${templateInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <templateInfo.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {resume.title}
                              </CardTitle>
                              <p className="text-sm text-slate-500">
                                {resume.personalInfo.name || "Untitled"}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-100 hover:scale-110 p-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4 text-slate-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 shadow-lg border-slate-200">
                              <DropdownMenuItem onClick={() => handleEditResume(resume.id)} className="cursor-pointer hover:bg-blue-50">
                                <Edit className="w-4 h-4 mr-2 text-blue-600" />
                                <span className="text-blue-700">Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateResume(resume)} className="cursor-pointer hover:bg-green-50">
                                <Copy className="w-4 h-4 mr-2 text-green-600" />
                                <span className="text-green-700">Duplicate</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-purple-50">
                                <Eye className="w-4 h-4 mr-2 text-purple-600" />
                                <span className="text-purple-700">Preview</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-orange-50">
                                <Download className="w-4 h-4 mr-2 text-orange-600" />
                                <span className="text-orange-700">Download</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteResume(resume.id)}
                                className="text-red-600 cursor-pointer hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                            </span>
                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                              {templateInfo.name}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600 space-y-1">
                              <p className="flex items-center space-x-1">
                                <Building className="w-4 h-4" />
                                <span>{resume.experiences.length} experiences</span>
                              </p>
                              <p className="flex items-center space-x-1">
                                <Code className="w-4 h-4" />
                                <span>{resume.skills.length} skills</span>
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditResume(resume.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-300 border-blue-300 hover:border-blue-400 hover:bg-blue-50 bg-white text-blue-700 hover:text-blue-800 font-medium shadow-sm hover:shadow-md"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit Resume
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
