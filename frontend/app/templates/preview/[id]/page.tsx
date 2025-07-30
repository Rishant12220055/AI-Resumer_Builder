"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Star, Users, CheckCircle, Crown, Palette, FileText, Zap, Eye } from "lucide-react"

interface Template {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  preview: string
  isPremium: boolean
  rating: number
  downloads: number
  tags: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fullDescription: string
  benefits: string[]
  idealFor: string[]
}

// Extended template data for preview
const templateData: Record<string, Template> = {
  professional: {
    id: "professional",
    name: "Professional Classic",
    category: "Professional",
    description: "Clean, traditional layout perfect for corporate environments and established professionals.",
    fullDescription:
      "The Professional Classic template is designed for experienced professionals who want to make a strong impression in traditional corporate environments. This template features a clean, organized layout that highlights your experience and achievements in a format that hiring managers and ATS systems love.",
    features: ["ATS-Friendly", "Clean Layout", "Professional Typography", "Easy to Read"],
    benefits: [
      "Passes all major ATS systems with 99% accuracy",
      "Preferred by Fortune 500 hiring managers",
      "Clean typography ensures excellent readability",
      "Professional color scheme builds trust and credibility",
    ],
    idealFor: [
      "Corporate Professionals",
      "Finance & Banking",
      "Consulting",
      "Management Roles",
      "Traditional Industries",
    ],
    preview: "/placeholder.svg?height=600&width=450",
    isPremium: false,
    rating: 4.8,
    downloads: 15420,
    tags: ["Corporate", "Traditional", "ATS-Friendly", "Clean"],
    colors: {
      primary: "#1e40af",
      secondary: "#64748b",
      accent: "#3b82f6",
    },
  },
  modern: {
    id: "modern",
    name: "Modern Minimalist",
    category: "Modern",
    description: "Contemporary design with clean lines and modern typography for tech professionals.",
    fullDescription:
      "The Modern Minimalist template combines contemporary design principles with functional layout to create a resume that stands out in the tech industry. Perfect for professionals who want to showcase their innovation and forward-thinking approach.",
    features: ["Modern Design", "Minimalist", "Tech-Focused", "Creative Layout"],
    benefits: [
      "Appeals to modern tech companies and startups",
      "Minimalist design focuses attention on your achievements",
      "Contemporary typography reflects innovation",
      "Optimized for digital viewing and sharing",
    ],
    idealFor: ["Software Engineers", "UX/UI Designers", "Product Managers", "Tech Startups", "Digital Marketing"],
    preview: "/placeholder.svg?height=600&width=450",
    isPremium: false,
    rating: 4.9,
    downloads: 12850,
    tags: ["Tech", "Minimalist", "Modern", "Creative"],
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#a855f7",
    },
  },
  creative: {
    id: "creative",
    name: "Creative Portfolio",
    category: "Creative",
    description: "Bold, creative design perfect for designers, artists, and creative professionals.",
    fullDescription:
      "The Creative Portfolio template is designed for creative professionals who want their resume to be a reflection of their artistic abilities. This template allows you to showcase your creativity while maintaining professional standards.",
    features: ["Creative Layout", "Color Accents", "Portfolio Focus", "Visual Appeal"],
    benefits: [
      "Showcases your design sensibility and creativity",
      "Color accents highlight key achievements",
      "Portfolio-focused sections for creative work",
      "Memorable design that stands out from the crowd",
    ],
    idealFor: ["Graphic Designers", "Artists", "Creative Directors", "Marketing Creatives", "Photographers"],
    preview: "/placeholder.svg?height=600&width=450",
    isPremium: true,
    rating: 4.7,
    downloads: 8930,
    tags: ["Creative", "Portfolio", "Design", "Artistic"],
    colors: {
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#eab308",
    },
  },
}

export default function TemplatePreview({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const templateInfo = templateData[params.id]
    if (!templateInfo) {
      router.push("/templates")
      return
    }
    setTemplate(templateInfo)
    setTimeout(() => setIsVisible(true), 100)
  }, [params.id, router])

  const handleUseTemplate = () => {
    if (!template) return

    // Create new resume with selected template
    const newResume = {
      id: Date.now(),
      title: `Resume - ${template.name}`,
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
      template: template.id,
    }

    const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]")
    const updatedResumes = [...savedResumes, newResume]
    localStorage.setItem("resumes", JSON.stringify(updatedResumes))

    // Redirect to the new resume
    router.push(`/resume/${newResume.id}`)
  }

  if (!template) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/templates"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Templates</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={handleUseTemplate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Template Preview */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
          >
            <div className="sticky top-24">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                <div className="relative">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={`${template.name} preview`}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {template.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: template.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Template Details */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-700">{template.category}</Badge>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{template.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{template.downloads.toLocaleString()} downloads</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-slate-900">{template.name}</h1>
              <p className="text-xl text-slate-600 leading-relaxed">{template.fullDescription}</p>
            </div>

            {/* Key Features */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Key Features</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Why Choose This Template</h3>
                </div>
                <ul className="space-y-3">
                  {template.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-slate-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Ideal For */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Perfect For</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.idealFor.map((role, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 hover:from-blue-200 hover:to-indigo-200 transition-colors"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Color Palette</h3>
                </div>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-lg shadow-lg border border-slate-200 mb-2"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    <span className="text-xs text-slate-500 font-mono">{template.colors.primary}</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-lg shadow-lg border border-slate-200 mb-2"
                      style={{ backgroundColor: template.colors.secondary }}
                    />
                    <span className="text-xs text-slate-500 font-mono">{template.colors.secondary}</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-lg shadow-lg border border-slate-200 mb-2"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                    <span className="text-xs text-slate-500 font-mono">{template.colors.accent}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center space-y-4">
              <Button
                onClick={handleUseTemplate}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 text-lg font-semibold py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Building Your Resume
              </Button>
              <p className="text-sm text-slate-500">Create your professional resume in minutes with this template</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  )
}
