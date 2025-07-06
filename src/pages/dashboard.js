"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Rocket,
  Plus,
  FileText,
  Download,
  Copy,
  Trash2,
  Edit3,
  Calendar,
  UserIcon,
  LogOut,
  Sparkles,
  Clock,
  MoreVertical,
  Search,
  Grid3X3,
  List,
} from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/auth/login"
      return
    }
    setUser(JSON.parse(userData))

    // Load user's resumes from localStorage
    const savedResumes = localStorage.getItem("resumes") || "[]"
    setResumes(JSON.parse(savedResumes))
    setLoading(false)

    // Trigger animations
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/auth/login"
  }

  const createNewResume = () => {
    const newResume = {
      id: Date.now(),
      title: "Untitled Resume",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      experiences: [{ id: 1, company: "", position: "", duration: "", bullets: [""] }],
      educations: [{ id: 1, institution: "", degree: "", duration: "", achievements: [""] }],
      skills: [],
      projects: [],
      certifications: [],
      template: "professional",
    }
    const updatedResumes = [...resumes, newResume]
    setResumes(updatedResumes)
    localStorage.setItem("resumes", JSON.stringify(updatedResumes))

    // Redirect to the new resume
    window.location.href = `/resume/${newResume.id}`
  }

  const deleteResume = (resumeId) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      const updatedResumes = resumes.filter((resume) => resume.id !== resumeId)
      setResumes(updatedResumes)
      localStorage.setItem("resumes", JSON.stringify(updatedResumes))
    }
  }

  const duplicateResume = (resume) => {
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
  }

  const filteredResumes = resumes.filter((resume) => resume.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-all duration-300">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link 
                href="/templates" 
                className="hidden sm:flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Templates</span>
              </Link>
              <div className="hidden sm:flex items-center space-x-2 text-slate-600">
                <UserIcon className="w-4 h-4" />
                <span className="font-medium">Welcome, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 bg-transparent px-4 py-2 rounded-lg border-2 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900">
                Welcome back,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {user?.name}!
                </span>
              </h1>
              <p className="text-xl text-slate-600 font-medium">
                Create, edit, and manage your professional resumes with AI assistance.
              </p>
            </div>

            {/* Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{resumes.length}</div>
                <div className="text-sm text-slate-500">Total Resumes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {resumes.filter((r) => new Date(r.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-slate-500">This Week</div>
              </div>
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
            <button
              onClick={createNewResume}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group px-6 py-3 rounded-lg font-semibold flex items-center"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Create New Resume
              <Sparkles className="w-4 h-4 ml-2" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  placeholder="Search resumes..."
                  className="pl-10 w-64 border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 border-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-slate-200 text-slate-600"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-slate-200 text-slate-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes Grid/List */}
        {filteredResumes.length > 0 ? (
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0 translate-y-10"
            }`}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fade-in-up rounded-xl p-6"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {resume.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(resume.updatedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <button 
                            onClick={() => deleteResume(resume.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-100 text-red-600"
                            title="Delete resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Resume Preview */}
                      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-lg p-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <div className="h-2 bg-slate-300 rounded w-3/4" />
                            <div className="h-2 bg-slate-200 rounded w-1/2" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-5/6" />
                        </div>
                      </div>

                      {/* Template Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-blue-100 text-blue-700 capitalize px-2 py-1 rounded-full text-sm">
                          {resume.template} Template
                        </span>
                        <div className="flex items-center space-x-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>Updated {formatDate(resume.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <Link href={`/resume/${resume.id}`} className="flex-1">
                          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group rounded-lg px-4 py-2 flex items-center justify-center">
                            <Edit3 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Edit Resume
                          </button>
                        </Link>
                        <button 
                          onClick={() => duplicateResume(resume)}
                          className="border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-transparent border-2 rounded-lg px-3 py-2"
                          title="Duplicate resume"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-transparent border-2 rounded-lg px-3 py-2">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm animate-fade-in-up rounded-xl p-6"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {resume.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span>Created {formatDate(resume.createdAt)}</span>
                            <span>•</span>
                            <span>Updated {formatDate(resume.updatedAt)}</span>
                            <span>•</span>
                            <span className="inline-block bg-blue-100 text-blue-700 capitalize px-2 py-1 rounded-full text-xs">
                              {resume.template}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/resume/${resume.id}`}>
                          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-4 py-2 flex items-center">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => duplicateResume(resume)}
                          className="border-slate-200 hover:border-slate-300 border-2 rounded-lg px-3 py-2"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="border-slate-200 hover:border-slate-300 border-2 rounded-lg px-3 py-2 bg-transparent">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteResume(resume.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 border-2 rounded-lg px-3 py-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`text-center py-16 transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {searchTerm ? "No resumes found" : "No resumes yet"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {searchTerm
                ? `No resumes match "${searchTerm}". Try a different search term.`
                : "Get started by creating your first professional resume with AI assistance."}
            </p>
            {!searchTerm && (
              <button
                onClick={createNewResume}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group px-6 py-3 rounded-lg font-semibold flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create Your First Resume
                <Sparkles className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  )
} 