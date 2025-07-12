import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <h2 className="text-xl font-semibold text-slate-900">Loading Dashboard...</h2>
        <p className="text-slate-600">Please wait while we load your resume data.</p>
      </div>
    </div>
  )
} 