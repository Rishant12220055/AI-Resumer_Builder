import { GetStaticProps } from 'next'
import { staticTemplates, categories, Template } from './static-templates'

interface StaticTemplatesPageProps {
  templates: Template[]
  categories: string[]
}

export default function StaticTemplatesPage({ templates, categories }: StaticTemplatesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Professional Resume Templates
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose from our collection of professionally designed templates to create your perfect resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors.primary}20, ${template.colors.secondary}20)`
                  }}
                >
                  <div className="text-center p-6">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: template.colors.primary }}
                    >
                      <span className="text-white font-bold text-lg">
                        {template.name.split(' ')[0][0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{template.name}</h3>
                    <p className="text-sm text-slate-600">{template.description}</p>
                  </div>
                </div>
                
                {template.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Premium
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-slate-700">{template.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500">{template.downloads.toLocaleString()} downloads</span>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${template.colors.primary}15`,
                          color: template.colors.primary,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">
                      {template.category}
                    </span>
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: template.colors.primary,
                        color: 'white',
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Template Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 rounded-full bg-white shadow-md text-slate-700 font-medium hover:shadow-lg transition-shadow"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<StaticTemplatesPageProps> = async () => {
  return {
    props: {
      templates: staticTemplates,
      categories,
    },
    revalidate: 3600, // Revalidate every hour
  }
} 