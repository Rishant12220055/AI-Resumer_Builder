export interface Template {
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

export const staticTemplates: Template[] = [
  {
    id: "professional",
    name: "Professional Classic",
    category: "Professional",
    description: "Clean, traditional layout perfect for corporate environments and established professionals.",
    features: ["ATS-Friendly", "Clean Layout", "Professional Typography", "Easy to Read"],
    preview: "/templates/professional-preview.png",
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
    preview: "/templates/modern-preview.png",
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
    preview: "/templates/creative-preview.png",
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
    preview: "/templates/executive-preview.png",
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
    preview: "/templates/academic-preview.png",
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
    preview: "/templates/startup-preview.png",
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
    preview: "/templates/minimal-preview.png",
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
    preview: "/templates/tech-preview.png",
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

export const categories = [
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

// Generate static paths for each template
export function generateStaticPaths() {
  return staticTemplates.map((template) => ({
    params: { id: template.id },
  }))
}

// Generate static props for a specific template
export function generateStaticProps(templateId: string) {
  const template = staticTemplates.find((t) => t.id === templateId)
  return {
    props: {
      template,
    },
  }
}

// Generate static props for the templates listing page
export function generateTemplatesListingProps() {
  return {
    props: {
      templates: staticTemplates,
      categories,
    },
  }
} 