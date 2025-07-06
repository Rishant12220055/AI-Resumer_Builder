import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Rocket, ArrowLeft, Search, Filter, Star, Eye, Download, Sparkles, Zap, Crown, CheckCircle, Users, TrendingUp
} from 'lucide-react';

const templates = [
  {
    id: "professional",
    name: "Professional Classic",
    category: "Professional",
    description: "Clean, traditional layout perfect for corporate environments and established professionals.",
    features: ["ATS-Friendly", "Clean Layout", "Professional Typography", "Easy to Read"],
    preview: "/placeholder.svg",
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
  {
    id: "modern",
    name: "Modern Minimalist",
    category: "Modern",
    description: "Contemporary design with clean lines and modern typography for tech professionals.",
    features: ["Modern Design", "Minimalist", "Tech-Focused", "Creative Layout"],
    preview: "/placeholder.svg",
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
  {
    id: "creative",
    name: "Creative Portfolio",
    category: "Creative",
    description: "Bold, creative design perfect for designers, artists, and creative professionals.",
    features: ["Creative Layout", "Color Accents", "Portfolio Focus", "Visual Appeal"],
    preview: "/placeholder.svg",
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
  {
    id: "executive",
    name: "Executive Elite",
    category: "Executive",
    description: "Premium template designed for C-level executives and senior management positions.",
    features: ["Executive Focus", "Premium Design", "Leadership Emphasis", "Sophisticated"],
    preview: "/placeholder.svg",
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
    preview: "/placeholder.svg",
    isPremium: false,
    rating: 4.6,
    downloads: 4320,
    tags: ["Academic", "Research", "Education", "Detailed"],
    colors: {
      primary: "#059669",
      secondary: "#065f46",
      accent: "#10b981",
    },
  },
  {
    id: "startup",
    name: "Startup Innovator",
    category: "Startup",
    description: "Dynamic template for entrepreneurs and startup professionals with growth mindset.",
    features: ["Startup Focus", "Innovation Emphasis", "Growth Metrics", "Dynamic Layout"],
    preview: "/placeholder.svg",
    isPremium: true,
    rating: 4.8,
    downloads: 7890,
    tags: ["Startup", "Innovation", "Entrepreneurship", "Growth"],
    colors: {
      primary: "#dc2626",
      secondary: "#ea580c",
      accent: "#f59e0b",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    category: "Minimal",
    description: "Ultra-clean, minimal design that focuses on content with maximum readability.",
    features: ["Ultra Clean", "Content Focus", "Maximum Readability", "Simple Layout"],
    preview: "/placeholder.svg",
    isPremium: false,
    rating: 4.5,
    downloads: 9870,
    tags: ["Minimal", "Clean", "Simple", "Readable"],
    colors: {
      primary: "#374151",
      secondary: "#6b7280",
      accent: "#9ca3af",
    },
  },
  {
    id: "tech",
    name: "Tech Professional",
    category: "Technology",
    description: "Designed specifically for software engineers, developers, and tech professionals.",
    features: ["Tech-Optimized", "Skills Showcase", "Project Focus", "GitHub Integration"],
    preview: "/placeholder.svg",
    isPremium: true,
    rating: 4.9,
    downloads: 11230,
    tags: ["Technology", "Developer", "Engineering", "Skills"],
    colors: {
      primary: "#0891b2",
      secondary: "#0e7490",
      accent: "#06b6d4",
    },
  },
];

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
];

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/login");
      return;
    }
    setTimeout(() => setIsVisible(true), 100);
  }, [router]);

  const filteredTemplates = templates
    .filter((template) => {
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPremium = !showPremiumOnly || template.isPremium;
      return matchesCategory && matchesSearch && matchesPremium;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleUseTemplate = (templateId) => {
    const newResume = {
      id: Date.now(),
      title: `Resume - ${templates.find((t) => t.id === templateId)?.name}`,
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
      template: templateId,
    };

    const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]");
    const updatedResumes = [...savedResumes, newResume];
    localStorage.setItem("resumes", JSON.stringify(updatedResumes));

    router.push(`/resume/${newResume.id}`);
  };

  const handlePreviewTemplate = (templateId) => {
    window.open(`/templates/preview/${templateId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Head>
        <title>Resume Templates - AI Resume Builder</title>
      </Head>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ResumeAI Templates
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredTemplates.length} Templates Available
              </span>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
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
              <input
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:border-blue-300 bg-white transition-colors"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedCategory}
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:border-blue-300 bg-white transition-colors"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Sort by {sortBy}
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setSortBy("popular");
                        setShowSortDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Most Popular
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("rating");
                        setShowSortDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Highest Rated
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("name");
                        setShowSortDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Name A-Z
                    </button>
                    <div className="border-t border-slate-200 my-1" />
                    <button
                      onClick={() => {
                        setShowPremiumOnly(!showPremiumOnly);
                        setShowSortDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Crown className="w-4 h-4 mr-2 inline" />
                      {showPremiumOnly ? "Show All" : "Premium Only"}
                    </button>
                  </div>
                )}
              </div>
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
                <div
                  key={template.id}
                  className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-white/80 backdrop-blur-sm animate-fade-in-up cursor-pointer rounded-xl overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="p-6">
                    {/* Template Preview */}
                    <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 aspect-[3/4]">
                      <img
                        src={template.preview || "/placeholder.svg"}
                        alt={`${template.name} preview`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />

                      {/* Overlay on Hover */}
                      <div
                        className={`absolute inset-0 bg-black/60 flex items-center justify-center space-x-3 transition-opacity duration-300 ${
                          hoveredTemplate === template.id ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() => handlePreviewTemplate(template.id)}
                          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 px-3 py-2 rounded-lg text-sm flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template.id)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-3 py-2 rounded-lg text-sm flex items-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Use Template
                        </button>
                      </div>

                      {/* Premium Badge */}
                      {template.isPremium && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg px-2 py-1 rounded-full text-xs flex items-center">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
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
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-slate-600">{template.rating}</span>
                        </div>
                      </div>

                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {template.category}
                      </span>

                      <p className="text-sm text-slate-600 line-clamp-2">{template.description}</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mt-4">
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full border-0 hover:bg-slate-200 transition-colors"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 3 && (
                          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full border-0">
                            +{template.features.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{template.downloads.toLocaleString()} downloads</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>ATS-Friendly</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handlePreviewTemplate(template.id)}
                          className="flex-1 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template.id)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 px-3 py-2 rounded-lg text-sm flex items-center justify-center"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No templates found</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to find the perfect template for your needs.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setShowPremiumOnly(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Popular Templates Section */}
        {selectedCategory === "All" && !searchTerm && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Most Popular
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
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
                  <div
                    key={template.id}
                    className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30 rounded-xl overflow-hidden"
                  >
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        {index === 0 && <Crown className="w-8 h-8 text-white" />}
                        {index === 1 && <Star className="w-8 h-8 text-white" />}
                        {index === 2 && <Zap className="w-8 h-8 text-white" />}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                      <p className="text-slate-600 mb-4">{template.description}</p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUseTemplate(template.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  );
} 