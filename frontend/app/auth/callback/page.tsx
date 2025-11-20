"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

type CallbackState = 'loading' | 'success' | 'error'

function CallbackPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setOAuthUser } = useAuth()
  const { toast } = useToast()
  const [state, setState] = useState<CallbackState>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Callback page loaded, processing authentication...')
        
        const token = searchParams.get("token")
        const user = searchParams.get("user")
        const error = searchParams.get("error")

        console.log('Callback parameters:', { 
          hasToken: !!token, 
          hasUser: !!user, 
          error 
        })

        if (error) {
          console.error('OAuth error from backend:', error)
          setState('error')
          setMessage(error)
          toast({
            title: "Authentication Error",
            description: error,
            variant: "destructive",
          })
          
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push("/auth/login")
          }, 3000)
          return
        }

        if (!token || !user) {
          const errorMsg = "No authentication data received"
          console.error(errorMsg, { token: !!token, user: !!user })
          setState('error')
          setMessage(errorMsg)
          toast({
            title: "Authentication Error",
            description: errorMsg,
            variant: "destructive",
          })
          
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push("/auth/login")
          }, 3000)
          return
        }

        try {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(user))
          console.log('Parsed user data:', userData)
          
          // Validate user data
          if (!userData.email || !userData.id) {
            throw new Error('Invalid user data received')
          }
          
          // Set authentication using OAuth method
          setOAuthUser(userData, token)
          console.log('OAuth user set, authentication complete')
          
          setState('success')
          setMessage('Authentication successful! Redirecting to dashboard...')
          
          toast({
            title: "Welcome!",
            description: `Successfully logged in as ${userData.name || userData.email}`,
          })
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            console.log('Redirecting to dashboard...')
            router.push("/dashboard")
          }, 2000)
          
        } catch (parseError) {
          console.error('Error parsing user data:', parseError)
          setState('error')
          setMessage('Failed to process authentication data')
          toast({
            title: "Authentication Error",
            description: "Failed to process authentication data",
            variant: "destructive",
          })
          
          setTimeout(() => {
            router.push("/auth/login")
          }, 3000)
        }
        
      } catch (error: any) {
        console.error("OAuth callback error:", error)
        setState('error')
        setMessage(error.message || 'Authentication failed')
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive",
        })
        
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    }
    
    handleCallback()
  }, [searchParams, router, setOAuthUser, toast])

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-700">Completing authentication...</h2>
            <p className="text-slate-500">Please wait while we log you in.</p>
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold text-green-700">Authentication Successful!</h2>
            <p className="text-slate-500">{message}</p>
          </>
        )
      case 'error':
        return (
          <>
            <XCircle className="w-12 h-12 mx-auto text-red-600" />
            <h2 className="text-xl font-semibold text-red-700">Authentication Failed</h2>
            <p className="text-slate-500">{message}</p>
            <p className="text-sm text-slate-400">Redirecting to login page...</p>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto p-6">
        {renderContent()}
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    }>
      <CallbackPageInner />
    </Suspense>
  )
}
