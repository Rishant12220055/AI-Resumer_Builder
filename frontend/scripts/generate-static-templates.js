const fs = require('fs')
const path = require('path')

// Import the static templates data
const { staticTemplates, categories } = require('../app/templates/static-templates.ts')

// Create the public/templates directory if it doesn't exist
const templatesDir = path.join(__dirname, '../public/templates')
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true })
}

// Generate static JSON files for each template
staticTemplates.forEach(template => {
  const templateData = {
    id: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    features: template.features,
    isPremium: template.isPremium,
    rating: template.rating,
    downloads: template.downloads,
    tags: template.tags,
    colors: template.colors,
    metadata: {
      title: `${template.name} - Resume Template`,
      description: template.description,
      keywords: [...template.tags, template.category, 'resume', 'template', 'cv'].join(', '),
      ogImage: template.preview,
    }
  }

  // Write individual template JSON file
  const templateFile = path.join(templatesDir, `${template.id}.json`)
  fs.writeFileSync(templateFile, JSON.stringify(templateData, null, 2))
  console.log(`Generated: ${templateFile}`)
})

// Generate templates index JSON file
const templatesIndex = {
  templates: staticTemplates,
  categories,
  metadata: {
    title: 'Professional Resume Templates',
    description: 'Choose from our collection of professionally designed templates to create your perfect resume',
    keywords: 'resume templates, cv templates, professional resume, modern resume, creative resume',
    totalTemplates: staticTemplates.length,
    premiumTemplates: staticTemplates.filter(t => t.isPremium).length,
    freeTemplates: staticTemplates.filter(t => !t.isPremium).length,
  }
}

const indexFile = path.join(templatesDir, 'index.json')
fs.writeFileSync(indexFile, JSON.stringify(templatesIndex, null, 2))
console.log(`Generated: ${indexFile}`)

// Generate sitemap entries for templates
const sitemapEntries = staticTemplates.map(template => ({
  url: `/templates/${template.id}`,
  lastmod: new Date().toISOString(),
  changefreq: 'monthly',
  priority: template.isPremium ? 0.8 : 0.6
}))

const sitemapFile = path.join(templatesDir, 'sitemap.json')
fs.writeFileSync(sitemapFile, JSON.stringify(sitemapEntries, null, 2))
console.log(`Generated: ${sitemapFile}`)

// Generate SEO metadata for each template
const seoMetadata = staticTemplates.map(template => ({
  id: template.id,
  title: `${template.name} - Professional Resume Template`,
  description: template.description,
  keywords: [...template.tags, template.category, 'resume', 'template', 'cv'].join(', '),
  ogTitle: `${template.name} Resume Template`,
  ogDescription: template.description,
  ogImage: template.preview,
  twitterCard: 'summary_large_image',
  canonical: `/templates/${template.id}`,
}))

const seoFile = path.join(templatesDir, 'seo-metadata.json')
fs.writeFileSync(seoFile, JSON.stringify(seoMetadata, null, 2))
console.log(`Generated: ${seoFile}`)

// Generate category pages data
const categoryData = categories.filter(cat => cat !== 'All').map(category => {
  const categoryTemplates = staticTemplates.filter(t => t.category === category)
  return {
    category,
    templates: categoryTemplates,
    count: categoryTemplates.length,
    metadata: {
      title: `${category} Resume Templates`,
      description: `Browse our collection of ${category.toLowerCase()} resume templates`,
      keywords: `${category.toLowerCase()}, resume templates, cv templates, professional resume`,
    }
  }
})

const categoriesFile = path.join(templatesDir, 'categories.json')
fs.writeFileSync(categoriesFile, JSON.stringify(categoryData, null, 2))
console.log(`Generated: ${categoriesFile}`)

console.log('\n✅ Static template generation complete!')
console.log(`📁 Generated ${staticTemplates.length} template files`)
console.log(`📊 Total templates: ${staticTemplates.length}`)
console.log(`⭐ Premium templates: ${staticTemplates.filter(t => t.isPremium).length}`)
console.log(`🆓 Free templates: ${staticTemplates.filter(t => !t.isPremium).length}`)
console.log(`📂 Categories: ${categories.length}`) 