"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  FileText,
  Download,
  Zap,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Lightbulb,
  Palette,
  Rocket,
  TrendingUp,
  Target,
} from "lucide-react"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      // If logged in, redirect to dashboard after a short delay
      const timer = setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
      return () => clearTimeout(timer)
    }

    // Scroll effect handler
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    // Observe all sections
    const sections = document.querySelectorAll("[data-scroll-section]")
    sections.forEach((section) => observer.observe(section))

    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Writing",
      description: "Get intelligent suggestions that transform your experience into compelling achievements.",
      gradient: "from-blue-500 to-blue-600",
      glow: "shadow-blue-500/20",
    },
    {
      icon: FileText,
      title: "Real-Time Preview",
      description: "Watch your resume update instantly with our lightning-fast preview system.",
      gradient: "from-indigo-500 to-indigo-600",
      glow: "shadow-indigo-500/20",
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description: "Choose from expertly designed templates that make recruiters take notice.",
      gradient: "from-purple-500 to-purple-600",
      glow: "shadow-purple-500/20",
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Download in PDF, DOCX, or TXT format. Perfect for any application system.",
      gradient: "from-teal-500 to-teal-600",
      glow: "shadow-teal-500/20",
    },
  ]

  const steps = [
    {
      icon: Lightbulb,
      title: "Input Your Details",
      description: "Add your experience and let our AI craft professional descriptions that stand out.",
      number: "01",
    },
    {
      icon: Zap,
      title: "AI Enhancement",
      description: "Get intelligent suggestions to optimize your resume for ATS systems and recruiters.",
      number: "02",
    },
    {
      icon: Target,
      title: "Land Interviews",
      description: "Download your polished resume and start getting those interview invitations.",
      number: "03",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      content:
        "The AI suggestions were incredible! I went from 0 responses to 5 interviews in just one week. This tool is a game-changer.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft",
      content:
        "The templates look amazing and the real-time preview saved me hours. Landed my dream job within a month!",
      rating: 5,
      avatar: "MJ",
    },
    {
      name: "Elena Rodriguez",
      role: "UX Designer",
      company: "Adobe",
      content:
        "Perfect for creating multiple resume versions. The export quality is outstanding and very professional.",
      rating: 5,
      avatar: "ER",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform duration-300 hover:scale-110"
                style={{
                  transform: `translateY(${scrollY * 0.02}px) rotate(${scrollY * 0.05}deg)`,
                }}
              >
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 font-semibold hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              className="space-y-8 animate-fade-in-up"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: Math.max(1 - scrollY * 0.002, 0),
              }}
            >
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg shadow-blue-500/25 text-sm font-semibold px-4 py-2 animate-bounce-subtle">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Resume Builder
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                  <span className="inline-block animate-slide-in-left">Build Resumes That</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-slide-in-right animation-delay-300">
                    Get You Hired
                  </span>
                  <span className="text-4xl md:text-5xl font-semibold animate-slide-in-left animation-delay-600">
                    Fast 🚀
                  </span>
                </h1>
                <p className="text-xl text-slate-700 max-w-2xl leading-relaxed font-medium animate-fade-in animation-delay-900">
                  Create professional resumes in minutes with AI-powered suggestions, beautiful templates, and real-time
                  optimization for ATS systems.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-1200">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group text-lg font-bold px-8 py-6 hover:scale-105"
                  >
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600 group bg-white/80 backdrop-blur-sm text-lg font-semibold px-8 py-6 hover:scale-105 transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-sm font-medium animate-fade-in animation-delay-1500">
                <div className="flex items-center space-x-2 text-blue-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Free Forever Plan</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span>50K+ Professionals</span>
                </div>
              </div>
            </div>

            {/* Resume Mockup */}
            <div
              className="relative animate-float"
              style={{
                transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px) translateX(${scrollY * -0.05}px)`,
              }}
            >
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 transform rotate-2 hover:rotate-0 transition-all duration-500 border border-slate-200 hover:scale-105">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg animate-pulse-subtle" />
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-800 rounded-lg w-36 animate-shimmer" />
                      <div className="h-3 bg-blue-500 rounded-lg w-28 animate-shimmer animation-delay-200" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-300 rounded-lg w-full animate-shimmer animation-delay-400" />
                    <div className="h-3 bg-slate-300 rounded-lg w-5/6 animate-shimmer animation-delay-600" />
                    <div className="h-3 bg-slate-300 rounded-lg w-4/6 animate-shimmer animation-delay-800" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg w-1/3 animate-shimmer animation-delay-1000" />
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-300 rounded-lg w-full animate-shimmer animation-delay-1200" />
                      <div className="h-3 bg-slate-300 rounded-lg w-3/4 animate-shimmer animation-delay-1400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/25 animate-bounce-gentle">
                AI Enhanced ✨
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-xl shadow-blue-500/10 animate-slide-in-left animation-delay-2000">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-slate-700">Live Preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div
          className="absolute top-20 left-10 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
          style={{
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="absolute top-40 right-10 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"
          style={{
            transform: `translate(${scrollY * -0.1}px, ${scrollY * 0.08}px)`,
          }}
        />
        <div
          className="absolute -bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"
          style={{
            transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.1}px)`,
          }}
        />
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-scroll-section
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.features ? "animate-fade-in-up" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-700 mb-6 text-lg font-semibold px-6 py-3 animate-bounce-subtle">
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}
                Stand Out
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Professional tools designed to help you create resumes that get results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl ${feature.glow} hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-3 bg-gradient-to-br from-white to-slate-50/50 animate-fade-in-up`}
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg ${feature.glow}`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        data-scroll-section
        className={`py-20 bg-gradient-to-br from-slate-50 to-blue-50/50 transition-all duration-1000 ${
          isVisible["how-it-works"] ? "animate-fade-in-up" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-6 text-lg font-semibold px-6 py-3 animate-bounce-subtle">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Three Simple Steps to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}
                Success
              </span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">Get your professional resume ready in minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{
                  animationDelay: `${index * 300}ms`,
                }}
              >
                <div className="relative mb-8">
                  <div
                    className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float"
                    style={{
                      animationDelay: `${index * 500}ms`,
                    }}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white border-3 border-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 shadow-lg animate-bounce-gentle"
                    style={{
                      animationDelay: `${index * 700}ms`,
                    }}
                  >
                    {step.number}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 font-medium text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        data-scroll-section
        className={`py-20 bg-white transition-all duration-1000 ${
          isVisible.testimonials ? "animate-fade-in-up" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-700 mb-6 text-lg font-semibold px-6 py-3 animate-bounce-subtle">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}
                Top Professionals
              </span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              Join 50,000+ professionals who have landed their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-slate-50/50 hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current animate-twinkle"
                        style={{
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic font-medium text-lg">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 text-white font-bold shadow-lg animate-pulse-subtle">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                      <div className="text-blue-600 font-semibold">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        data-scroll-section
        className={`py-20 bg-gradient-to-br from-slate-50 to-blue-50/50 transition-all duration-1000 ${
          isVisible.pricing ? "animate-fade-in-up" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mb-6 text-lg font-semibold px-6 py-3 animate-bounce-subtle">
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Choose Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}
                Perfect Plan
              </span>
            </h2>
            <p className="text-xl text-slate-600 font-medium">Transparent pricing with no hidden fees</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white hover:scale-105 animate-fade-in-up">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4 animate-bounce-gentle">🆓</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                  <div className="text-5xl font-bold text-slate-900 mb-2">$0</div>
                  <p className="text-slate-600 font-medium">Perfect for getting started</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {["1 Professional Resume", "Basic Templates", "PDF Export", "AI Suggestions", "Email Support"].map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-center animate-slide-in-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                        <span className="text-slate-600 font-medium">{feature}</span>
                      </li>
                    ),
                  )}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg py-6 hover:scale-105 transition-all duration-300">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 shadow-2xl relative bg-gradient-to-br from-white to-blue-50/30 hover:scale-105 transition-all duration-500 animate-fade-in-up animation-delay-200">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold px-6 py-2 shadow-lg animate-bounce-gentle">
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4 animate-twinkle">⭐</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    $12
                  </div>
                  <p className="text-slate-600 font-medium">per month</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited Resumes",
                    "Premium Templates",
                    "All Export Formats",
                    "Advanced AI Features",
                    "Priority Support",
                    "Analytics Dashboard",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center animate-slide-in-right"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="text-slate-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg py-6 shadow-lg shadow-blue-500/25 hover:scale-105 transition-all duration-300">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        data-scroll-section
        className={`py-20 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden transition-all duration-1000 ${
          isVisible.cta ? "animate-fade-in-up" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-in-up">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-medium animate-fade-in animation-delay-300">
            Join 50,000+ professionals who have used ResumeAI to create resumes that get results.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-600">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 group font-bold text-lg px-10 py-6 hover:scale-110"
              >
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-bold text-lg px-10 py-6 hover:scale-110 transition-all duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-subtle">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  ResumeAI
                </span>
              </div>
              <p className="text-slate-400 max-w-xs font-medium">
                Create professional resumes with AI assistance. Built for the next generation of professionals.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors font-medium hover:translate-x-1 inline-block duration-300"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm font-medium">© 2024 ResumeAI. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-slate-400 font-medium">
                <Users className="w-4 h-4" />
                <span>50,000+ professionals</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current animate-twinkle"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
                <span className="text-sm text-slate-400 ml-2 font-medium">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
