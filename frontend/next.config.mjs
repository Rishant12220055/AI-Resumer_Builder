/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static generation
  output: 'export',
  trailingSlash: true,
  // Generate static pages for templates
  async generateStaticParams() {
    return [
      { slug: 'templates' },
      { slug: 'templates/professional' },
      { slug: 'templates/modern' },
      { slug: 'templates/creative' },
      { slug: 'templates/executive' },
      { slug: 'templates/academic' },
      { slug: 'templates/startup' },
      { slug: 'templates/minimal' },
      { slug: 'templates/tech' },
    ]
  },
}

export default nextConfig
