"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import config from "@/lib/config"
import {
  Rocket,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
  User,
  CheckCircle,
  Sparkles,
  Shield,
} from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 FORM SUBMITTED - DEBUG MODE ACTIVE!', formData);
    e.preventDefault();
    setError(null);
    
    // Validation checks with logging
    if (formData.password !== formData.confirmPassword) {
      console.log('Validation failed: Passwords do not match');
      setError("Passwords don't match!");
      return;
    }
    if (!formData.agreeToTerms) {
      console.log('Validation failed: Terms not agreed');
      setError("Please agree to the terms and conditions");
      return;
    }
    
    console.log('All validations passed, proceeding with signup...');
    setIsLoading(true);
    try {
      console.log('Attempting signup with:', { firstName: formData.firstName, lastName: formData.lastName, email: formData.email });
      await signup(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      );
      console.log('Signup successful, redirecting to dashboard...');
      // Give a small delay for state to update
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 100);
    } catch (err: any) {
      console.error('Signup error:', err);
      setIsLoading(false);
      setError(err?.message || "Signup failed. Please try again.");
    }
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Initiating ${provider} OAuth...`);
      
      if (provider === 'google') {
        const response = await fetch(`${config.API_BASE_URL}/auth/google/url`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to get Google auth URL');
        }
        
        // Redirect to Google OAuth
        window.location.href = data.url;
      } else if (provider === 'github') {
        const response = await fetch(`${config.API_BASE_URL}/auth/github/url`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to get GitHub auth URL');
        }
        
        // Redirect to GitHub OAuth
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      setError(error.message || `${provider} authentication failed`);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded shadow z-50">
          {error}
        </div>
      )}
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
              <h1 className="text-3xl font-bold text-slate-900">Create Your Account [DEBUG v2]</h1>
              <p className="text-slate-600 font-medium">Join 50,000+ professionals building amazing resumes</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 bg-white transition-all duration-300 group shadow-sm"
                onClick={() => handleSocialSignup("google")}
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-700">Sign up with Google</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 border-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 bg-white transition-all duration-300 group shadow-sm"
                onClick={() => handleSocialSignup("github")}
                disabled={isLoading}
              >
                <Github className="w-5 h-5 mr-3 text-slate-700 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-slate-700">Sign up with GitHub</span>
              </Button>
            </div>

            <div className="relative">
              <Separator className="my-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Badge className="bg-white text-slate-500 px-4 py-1 border border-slate-200">
                  or create account with email
                </Badge>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 border-2 border-slate-200 focus:border-blue-500 transition-colors"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-slate-600 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in animation-delay-600">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
