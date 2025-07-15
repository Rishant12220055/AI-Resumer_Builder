export default function TemplatesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/30 to-fuchsia-50/50">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-violet-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-6 bg-violet-200 rounded animate-pulse" />
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg animate-pulse" />
                <div className="w-32 h-6 bg-violet-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-24 h-6 bg-violet-200 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <div className="w-96 h-12 bg-violet-200 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-80 h-6 bg-violet-100 rounded mx-auto animate-pulse" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="w-64 h-10 bg-violet-200 rounded animate-pulse" />
            <div className="flex items-center space-x-4">
              <div className="w-24 h-10 bg-violet-200 rounded animate-pulse" />
              <div className="w-32 h-10 bg-violet-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Templates Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Template Preview Skeleton */}
              <div className="aspect-[3/4] bg-gradient-to-br from-violet-100 to-purple-200 rounded-lg mb-4" />

              {/* Template Info Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="w-32 h-5 bg-violet-200 rounded" />
                  <div className="w-12 h-4 bg-violet-200 rounded" />
                </div>
                <div className="w-20 h-4 bg-violet-200 rounded" />
                <div className="w-full h-8 bg-violet-100 rounded" />
              </div>

              {/* Features Skeleton */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  <div className="w-16 h-5 bg-slate-200 rounded-full" />
                  <div className="w-20 h-5 bg-slate-200 rounded-full" />
                  <div className="w-14 h-5 bg-slate-200 rounded-full" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="w-24 h-3 bg-slate-200 rounded" />
                  <div className="w-20 h-3 bg-slate-200 rounded" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex space-x-2 pt-2">
                  <div className="flex-1 h-8 bg-violet-200 rounded" />
                  <div className="flex-1 h-8 bg-violet-300 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Templates Section Skeleton */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="w-64 h-8 bg-violet-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-48 h-5 bg-violet-100 rounded mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-violet-50/30 rounded-xl shadow-lg p-6 text-center animate-pulse"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl mx-auto mb-4" />
                <div className="w-32 h-6 bg-violet-200 rounded mx-auto mb-2" />
                <div className="w-full h-16 bg-violet-100 rounded mb-4" />
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-12 h-4 bg-slate-200 rounded" />
                  <div className="w-16 h-4 bg-slate-200 rounded" />
                </div>
                <div className="w-full h-10 bg-violet-300 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  )
}
