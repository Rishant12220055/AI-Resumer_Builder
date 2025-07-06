import { Rocket, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-blue-500/25">
            <Rocket className="w-10 h-10 text-white animate-bounce" />
          </div>
          
          {/* Orbiting Sparkles */}
          <div className="absolute inset-0 animate-spin">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            ResumeAI
          </h2>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-2 bg-slate-200 rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

        {/* Status Text */}
        <p className="text-sm text-slate-500 font-medium">
          Loading your experience...
        </p>
      </div>

      {/* Background Elements */}
      <div className="fixed top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob pointer-events-none" />
      <div className="fixed top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="fixed -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  );
} 