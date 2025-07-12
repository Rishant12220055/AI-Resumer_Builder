export default function TemplatesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-5 w-32 bg-slate-200 rounded animate-shimmer" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-shimmer" />
                <div className="h-6 w-40 bg-slate-200 rounded animate-shimmer" />
              </div>
            </div>
            <div className="h-8 w-32 rounded-full bg-slate-200 animate-shimmer" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 w-96 mx-auto mb-4 bg-slate-200 rounded animate-shimmer" />
          <div className="h-6 w-[600px] mx-auto bg-slate-200 rounded animate-shimmer" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="h-10 w-80 bg-slate-200 rounded animate-shimmer" />
            <div className="flex items-center space-x-4">
              <div className="h-10 w-32 bg-slate-200 rounded animate-shimmer" />
              <div className="h-10 w-32 bg-slate-200 rounded animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Templates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden">
              <div className="p-6">
                {/* Template Preview Image */}
                <div className="aspect-[3/4] w-full rounded-lg mb-4 bg-slate-200 animate-shimmer" />
                
                {/* Template Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-slate-200 rounded animate-shimmer" />
                    <div className="h-4 w-12 bg-slate-200 rounded animate-shimmer" />
                  </div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-shimmer" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-shimmer" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-shimmer" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <div className="h-5 w-16 bg-slate-200 rounded animate-shimmer" />
                  <div className="h-5 w-20 bg-slate-200 rounded animate-shimmer" />
                  <div className="h-5 w-14 bg-slate-200 rounded animate-shimmer" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer" />
                  <div className="h-4 w-20 bg-slate-200 rounded animate-shimmer" />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <div className="h-8 flex-1 bg-slate-200 rounded animate-shimmer" />
                  <div className="h-8 flex-1 bg-slate-200 rounded animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 