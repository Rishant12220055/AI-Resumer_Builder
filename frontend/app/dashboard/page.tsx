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
  User,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api, Resume } from "@/lib/api"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const fetchedResumes = await api.getResumes()
        setResumes(fetchedResumes)
      } catch (error: any) {
        console.error("Error loading resumes:", error)
        toast({
          title: "Error",
          description: "Failed to load resumes. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }
    if (user) {
      loadResumes()
    }
  }, [user, toast])

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resume.personalInfo?.firstName?.toLowerCase() + ' ' + resume.personalInfo?.lastName?.toLowerCase()).includes(searchTerm.toLowerCase())
  )

  const handleCreateResume = async () => {
    try {
      const newResume = await api.createResume({ title: "Untitled Resume" })
      router.push(`/resume/${newResume._id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create resume.",
        variant: "destructive",
      })
    }
  }

  const handleEditResume = (resumeId: string) => {
    router.push(`/resume/${resumeId}`)
  }

  const handlePreviewResume = (resumeId: string) => {
    router.push(`/resume/${resumeId}/preview`)
  }

  const handleDownloadResume = (resume: Resume) => {
    // TODO: Implement PDF download functionality
    toast({
      title: "Coming Soon",
      description: "PDF download will be available soon!",
    })
  }

  const handleBrowseTemplates = () => {
    // Route to the templates page
    router.push('/templates')
  }

  const handleDuplicateResume = async (resume: Resume) => {
    try {
      const duplicated = await api.createResume({ title: `${resume.title} (Copy)`, template: resume.template })
      toast({ title: "Resume duplicated!" })
      setResumes((prev) => [...prev, duplicated])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to duplicate resume.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await api.deleteResume(resumeId)
      setResumes((prev) => prev.filter((r) => r._id !== resumeId))
      toast({ title: "Resume deleted." })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete resume.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/auth/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-24 mx-auto animate-pulse" />
          </div>
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
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
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
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-slate-700">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Sign Out
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
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-lg text-slate-600">Ready to create your next professional resume?</p>
            </div>

            <div className="flex items-center space-x-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{resumes.length}</div>
                  <div className="text-sm opacity-90">Total Resumes</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {
                      resumes.filter((r) => new Date(r.updatedAt || '1970-01-01') > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                        .length
                    }
                  </div>
                  <div className="text-sm opacity-90">This Week</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleCreateResume}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Button>
              <Button 
                onClick={handleBrowseTemplates}
                variant="outline" 
                className="border-slate-200 hover:border-blue-300 bg-transparent"
              >
                <Palette className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search resumes..."
                  className="pl-10 w-64 border-slate-200 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-white shadow-sm" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes Section */}
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0 translate-y-10"
          }`}
        >
          {filteredResumes.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredResumes.map((resume, index) => {
                const templateInfo = getTemplateInfo(resume.template)
                const IconComponent = templateInfo.icon

                return viewMode === "grid" ? (
                  <Card
                    key={resume._id}
                    className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 ${templateInfo.color} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditResume(resume._id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateResume(resume)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePreviewResume(resume._id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadResume(resume)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteResume(resume._id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {resume.title}
                      </CardTitle>

                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-700 text-xs">{templateInfo.name}</Badge>
                        {resume.personalInfo?.firstName && resume.personalInfo?.lastName && (
                          <Badge className="bg-slate-100 text-slate-600 text-xs">{resume.personalInfo.firstName} {resume.personalInfo.lastName}</Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Updated {new Date(resume.updatedAt || '1970-01-01').toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{(resume.experiences?.length ?? 0)} exp</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditResume(resume._id)}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handlePreviewResume(resume._id)}
                            variant="outline"
                            size="sm"
                            className="border-slate-200 hover:border-blue-300 hover:bg-blue-50 bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card
                    key={resume._id}
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 ${templateInfo.color} rounded-lg flex items-center justify-center shadow-lg`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {resume.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-blue-100 text-blue-700 text-xs">{templateInfo.name}</Badge>
                              {resume.personalInfo?.firstName && resume.personalInfo?.lastName && (
                                <Badge className="bg-slate-100 text-slate-600 text-xs">
                                  {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                                </Badge>
                              )}
                              <span className="text-sm text-slate-500">
                                Updated {new Date(resume.updatedAt || '1970-01-01').toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleEditResume(resume._id)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                            size="sm"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-200 hover:border-blue-300 bg-transparent"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDuplicateResume(resume)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePreviewResume(resume._id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadResume(resume)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteResume(resume._id)} className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {searchTerm ? "No resumes found" : "No resumes yet"}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Create your first professional resume with our AI-powered builder and beautiful templates."}
              </p>
              <Button
                onClick={searchTerm ? () => setSearchTerm("") : handleCreateResume}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              >
                {searchTerm ? (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Clear Search
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Resume
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
      </div>
    </ProtectedRoute>
  )
}
