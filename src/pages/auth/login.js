"use client"

import { useState } from "react"
import Link from "next/link"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Sparkles, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Save user data to localStorage
      const userData = {
        name: formData.email.split('@')[0], // Use email prefix as name for demo
        email: formData.email
      }
      localStorage.setItem("user", JSON.stringify(userData))
      // Redirect to dashboard
      window.location.href = "/dashboard"
    }, 2000)
  }

  const handleSocialLogin = (provider) => {
    setIsLoading(true)
    // Simulate social login
    setTimeout(() => {
      setIsLoading(false)
      // Save user data to localStorage
      const userData = {
        name: provider === "google" ? "Google User" : "GitHub User",
        email: provider === "google" ? "user@gmail.com" : "user@github.com"
      }
      localStorage.setItem("user", JSON.stringify(userData))
      window.location.href = "/dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-all duration-300">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>
        </div>

        <div className="border-0 shadow-2xl shadow-blue-500/10 bg-white/80 backdrop-blur-xl animate-fade-in-up animation-delay-200 rounded-xl p-8">
          <div className="text-center pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
              <p className="text-slate-600 font-medium">Sign in to continue building amazing resumes</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                className="w-full h-12 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group bg-transparent rounded-lg flex items-center justify-center"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Continue with Google</span>
              </button>

              <button
                className="w-full h-12 border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-300 group bg-transparent rounded-lg flex items-center justify-center"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
              >
                <Github className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Continue with GitHub</span>
              </button>
            </div>

            <div className="relative">
              <div className="border-t border-slate-200 my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white text-slate-500 px-4 py-1 border border-slate-200 rounded-full text-sm">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors rounded-lg px-3"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors rounded-lg px-3"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group rounded-lg flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in animation-delay-600">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>50K+ Users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 