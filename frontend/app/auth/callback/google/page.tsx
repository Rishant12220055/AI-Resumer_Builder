"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { tokenStorage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function GoogleCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get('token')
    const userParam = searchParams.get('user')

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        
        // Store authentication data
        tokenStorage.setToken(token)
        tokenStorage.setUser(user)
        
        toast({
          title: "Welcome!",
          description: `Successfully logged in as ${user.name}`,
        })
        
        // Redirect to dashboard
        router.push("/dashboard")
      } catch (error) {
        console.error('Error parsing user data:', error)
        toast({
          title: "Authentication Error",
          description: "Failed to complete Google login. Please try again.",
          variant: "destructive",
        })
        router.push("/auth/login?error=Failed to complete authentication")
      }
    } else {
      // No token or user data, redirect to login with error
      router.push("/auth/login?error=Authentication failed")
    }
  }, [searchParams, router, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <h2 className="text-xl font-semibold text-slate-900">Completing Google Login...</h2>
        <p className="text-slate-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  )
} 