"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Rocket,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Eye,
  Download,
  Sparkles,
  Zap,
  Crown,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/protected-route"

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
}

const templates: Template[] = [
  {
    id: "professional",
    name: "Professional Classic",
    category: "Professional",
    description: "Clean, traditional layout perfect for corporate environments and established professionals.",
    features: ["ATS-Friendly", "Clean Layout", "Professional Typography", "Easy to Read"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: false,
    rating: 4.8,
    downloads: 15420,
    tags: ["Corporate", "Traditional", "ATS-Friendly", "Clean"],
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#c084fc",
    },
  },
  {
    id: "modern",
    name: "Modern Minimalist",
    category: "Modern",
    description: "Contemporary design with clean lines and modern typography for tech professionals.",
    features: ["Modern Design", "Minimalist", "Tech-Focused", "Creative Layout"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: false,
    rating: 4.9,
    downloads: 12850,
    tags: ["Tech", "Minimalist", "Modern", "Creative"],
    colors: {
      primary: "#06b6d4",
      secondary: "#0891b2",
      accent: "#67e8f9",
    },
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    category: "Creative",
    description: "Bold, creative design perfect for designers, artists, and creative professionals.",
    features: ["Creative Layout", "Color Accents", "Portfolio Focus", "Visual Appeal"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: true,
    rating: 4.7,
    downloads: 8930,
    tags: ["Creative", "Portfolio", "Design", "Artistic"],
    colors: {
      primary: "#f59e0b",
      secondary: "#f97316",
      accent: "#fbbf24",
    },
  },
  {
    id: "executive",
    name: "Executive Elite",
    category: "Executive",
    description: "Premium template designed for C-level executives and senior management positions.",
    features: ["Executive Focus", "Premium Design", "Leadership Emphasis", "Sophisticated"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: true,
    rating: 4.9,
    downloads: 5670,
    tags: ["Executive", "Premium", "Leadership", "Sophisticated"],
    colors: {
      primary: "#1f2937",
      secondary: "#374151",
      accent: "#6b7280",
    },
  },
  {
    id: "academic",
    name: "Academic Scholar",
    category: "Academic",
    description: "Structured template ideal for researchers, professors, and academic professionals.",
    features: ["Academic Format", "Publication Focus", "Research Emphasis", "Detailed Sections"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: false,
    rating: 4.6,
    downloads: 4320,
    tags: ["Academic", "Research", "Education", "Detailed"],
    colors: {
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
    },
  },
  {
    id: "startup",
    name: "Startup Innovator",
    category: "Startup",
    description: "Dynamic template for entrepreneurs and startup professionals with growth mindset.",
    features: ["Startup Focus", "Innovation Emphasis", "Growth Metrics", "Dynamic Layout"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: true,
    rating: 4.8,
    downloads: 7890,
    tags: ["Startup", "Innovation", "Entrepreneurship", "Growth"],
    colors: {
      primary: "#ef4444",
      secondary: "#dc2626",
      accent: "#f87171",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    category: "Minimal",
    description: "Ultra-clean, minimal design that focuses on content with maximum readability.",
    features: ["Ultra Clean", "Content Focus", "Maximum Readability", "Simple Layout"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: false,
    rating: 4.5,
    downloads: 9870,
    tags: ["Minimal", "Clean", "Simple", "Readable"],
    colors: {
      primary: "#64748b",
      secondary: "#475569",
      accent: "#94a3b8",
    },
  },
  {
    id: "tech",
    name: "Tech Professional",
    category: "Technology",
    description: "Designed specifically for software engineers, developers, and tech professionals.",
    features: ["Tech-Optimized", "Skills Showcase", "Project Focus", "GitHub Integration"],
    preview: "/placeholder.svg?height=400&width=300",
    isPremium: true,
    rating: 4.9,
    downloads: 11230,
    tags: ["Technology", "Developer", "Engineering", "Skills"],
    colors: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#a78bfa",
    },
  },
]

const categories = [
  "All",
  "Professional",
  "Modern",
  "Creative",
  "Executive",
  "Academic",
  "Startup",
  "Minimal",
  "Technology",
]

export default function TemplatesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const filteredTemplates = templates
    .filter((template) => {
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPremium = !showPremiumOnly || template.isPremium
      return matchesCategory && matchesSearch && matchesPremium
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const handleUseTemplate = async (templateId: string) => {
    try {
      const template = templates.find((t) => t.id === templateId)
      const newResume = await api.createResume({ 
        title: `Resume - ${template?.name || 'New Resume'}`,
        template: templateId
      })
      
      toast({
        title: "Resume Created",
        description: `Created new resume with ${template?.name} template`,
      })
      
      // Redirect to the new resume
      router.push(`/resume/${newResume._id}`)
    } catch (error: any) {
      console.error("Error creating resume:", error)
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePreviewTemplate = (templateId: string) => {
    // Open preview in new tab or modal
    window.open(`/templates/preview/${templateId}`, "_blank")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-violet-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-slate-600 hover:text-violet-600 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Dashboard</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    ResumeAI Templates
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge className="bg-violet-100 text-violet-700 px-3 py-1">
                  {filteredTemplates.length} Templates Available
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                {" "}
                Resume Template
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Professional, ATS-friendly templates designed by experts to help you land your dream job
            </p>
          </div>

          {/* Filters and Search */}
          <div
            className={`mb-8 transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10 border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                {/* Category Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-violet-200 hover:border-violet-300 bg-transparent hover:bg-violet-50"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {selectedCategory}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-violet-200 hover:border-violet-300 bg-transparent hover:bg-violet-50"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Sort by {sortBy}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>Most Popular</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>Highest Rated</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>Name A-Z</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowPremiumOnly(!showPremiumOnly)}>
                      <Crown className="w-4 h-4 mr-2" />
                      {showPremiumOnly ? "Show All" : "Premium Only"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "animate-fade-in-up animation-delay-400" : "opacity-0 translate-y-10"
            }`}
          >
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template, index) => (
                  <Card
                    key={template.id}
                    className="group hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fade-in-up cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    <CardHeader className="pb-3">
                      {/* Template Preview */}
                      <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-violet-100 to-purple-200 aspect-[3/4]">
                        <img
                          src={template.preview || "/placeholder.svg"}
                          alt={`${template.name} preview`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Overlay on Hover */}
                        <div
                          className={`absolute inset-0 bg-black/60 flex items-center justify-center space-x-3 transition-opacity duration-300 ${
                            hoveredTemplate === template.id ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <Button
                            onClick={() => handlePreviewTemplate(template.id)}
                            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            onClick={() => handleUseTemplate(template.id)}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </div>

                        {/* Premium Badge */}
                        {template.isPremium && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                              <Crown className="w-3 h-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}

                        {/* Color Palette */}
                        <div className="absolute bottom-3 left-3 flex space-x-1">
                          <div
                            className="w-3 h-3 rounded-full border border-white/50"
                            style={{ backgroundColor: template.colors.primary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-white/50"
                            style={{ backgroundColor: template.colors.secondary }}
                          />
                          <div
                            className="w-3 h-3 rounded-full border border-white/50"
                            style={{ backgroundColor: template.colors.accent }}
                          />
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                            {template.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-sm font-medium text-slate-600">{template.rating}</span>
                          </div>
                        </div>

                        <Badge className="bg-violet-100 text-violet-700 text-xs">{template.category}</Badge>

                        <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Features */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, idx) => (
                            <Badge
                              key={idx}
                              className="bg-slate-100 text-slate-600 text-xs border-0 hover:bg-slate-200 transition-colors"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {template.features.length > 3 && (
                            <Badge className="bg-slate-100 text-slate-600 text-xs border-0">
                              +{template.features.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{template.downloads.toLocaleString()} downloads</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span>ATS-Friendly</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={() => handlePreviewTemplate(template.id)}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-violet-200 hover:border-violet-300 hover:bg-violet-50"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            onClick={() => handleUseTemplate(template.id)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No templates found</h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find the perfect template for your needs.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("All")
                    setShowPremiumOnly(false)
                  }}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Popular Templates Section */}
          {selectedCategory === "All" && !searchTerm && (
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Most Popular
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                    {" "}
                    Templates
                  </span>
                </h2>
                <p className="text-lg text-slate-600">Trusted by thousands of professionals worldwide</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {templates
                  .sort((a, b) => b.downloads - a.downloads)
                  .slice(0, 3)
                  .map((template, index) => (
                    <Card
                      key={template.id}
                      className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-violet-50/30"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          {index === 0 && <Crown className="w-8 h-8 text-white" />}
                          {index === 1 && <Star className="w-8 h-8 text-white" />}
                          {index === 2 && <Zap className="w-8 h-8 text-white" />}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                        <p className="text-slate-600 mb-4">{template.description}</p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span>{template.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{template.downloads.toLocaleString()}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleUseTemplate(template.id)}
                          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Background Elements */}
        <div className="fixed top-20 left-10 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
        <div className="fixed top-40 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
        <div className="fixed -bottom-20 left-20 w-80 h-80 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
      </div>
    </ProtectedRoute>
  )
}
