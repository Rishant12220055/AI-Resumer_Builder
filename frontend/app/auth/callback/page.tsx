"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setOAuthUser } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get("token")
        const user = searchParams.get("user")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(error)
        }

        if (token && user) {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(user))
          
          // Set authentication using OAuth method
          setOAuthUser(userData, token)

          toast({
            title: "Success!",
            description: "You have been logged in successfully.",
          })

          // Redirect to dashboard
          router.push("/dashboard")
        } else {
          throw new Error("No authentication data received")
        }
      } catch (error: any) {
        console.error("OAuth callback error:", error)
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive",
        })
        router.push("/auth/login")
      }
    }

    handleCallback()
  }, [searchParams, router, setOAuthUser, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-700">Completing authentication...</h2>
        <p className="text-slate-500">Please wait while we log you in.</p>
      </div>
    </div>
  )
}
