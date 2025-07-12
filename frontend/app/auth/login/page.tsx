"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { apiClient, tokenStorage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { isAuthenticated, isLoading: authLoading, login } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  // Check for error messages from OAuth callbacks
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      toast({
        title: "Authentication Error",
        description: decodeURIComponent(error),
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await login(formData.email.trim(), formData.password)
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${formData.email}`,
      })
      router.push("/dashboard")
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.'
        } else if (error.message.includes('Network error')) {
          errorMessage = 'Network error. Please check your internet connection.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const response = await apiClient.getGoogleAuthUrl()
      window.location.href = response.url
    } catch (error) {
      console.error('Google auth error:', error)
      toast({
        title: "Google Login Error",
        description: "Failed to initiate Google login. Please try again.",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setIsGithubLoading(true)
    try {
      const response = await apiClient.getGitHubAuthUrl()
      window.location.href = response.url
    } catch (error) {
      console.error('GitHub auth error:', error)
      toast({
        title: "GitHub Login Error",
        description: "Failed to initiate GitHub login. Please try again.",
        variant: "destructive",
      })
      setIsGithubLoading(false)
    }
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

        <Card className="border-0 shadow-2xl shadow-blue-500/10 bg-white/80 backdrop-blur-xl animate-fade-in-up animation-delay-200">
          <CardHeader className="text-center pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Welcome Back!</h1>
              <p className="text-slate-600 font-medium">Sign in to continue building amazing resumes</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-slate-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300 group bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                aria-describedby="google-status"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <Chrome className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-semibold text-slate-700 group-hover:text-red-600 transition-colors">
                  {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
                </span>
              </Button>
              <div id="google-status" className="sr-only" aria-live="polite">
                {isGoogleLoading ? "Connecting to Google..." : "Ready to connect with Google"}
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-2 border-slate-300 hover:border-slate-600 hover:bg-slate-50 transition-all duration-300 group bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                onClick={handleGithubLogin}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                aria-describedby="github-status"
              >
                {isGithubLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-3" />
                ) : (
                  <Github className="w-5 h-5 mr-3 text-slate-700 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {isGithubLoading ? "Connecting to GitHub..." : "Continue with GitHub"}
                </span>
              </Button>
              <div id="github-status" className="sr-only" aria-live="polite">
                {isGithubLoading ? "Connecting to GitHub..." : "Ready to connect with GitHub"}
              </div>
            </div>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge className="bg-white text-slate-500 px-4 py-1 border border-slate-200">
                  or continue with email
                </Badge>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={`pl-10 h-12 border-2 transition-colors ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) {
                        setErrors({ ...errors, email: '' })
                      }
                    }}
                    required
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div id="email-error" className="flex items-center mt-1 text-sm text-red-600" role="alert">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 h-12 border-2 transition-colors ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) {
                        setErrors({ ...errors, password: '' })
                      }
                    }}
                    required
                    aria-describedby={errors.password ? "password-error" : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <div id="password-error" className="flex items-center mt-1 text-sm text-red-600" role="alert">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                    id="remember-me"
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                aria-describedby="submit-status"
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
              </Button>
              <div id="submit-status" className="sr-only" aria-live="polite">
                {isLoading ? "Signing in..." : "Ready to sign in"}
              </div>
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
          </CardContent>
        </Card>

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
