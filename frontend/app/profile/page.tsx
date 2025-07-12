"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  Settings,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe as WebsiteIcon,
  Save,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { apiClient, tokenStorage } from "@/lib/api"

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  bio?: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: {
      email: boolean
      browser: boolean
      marketing: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private'
      dataSharing: boolean
    }
  }
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [hasMounted, setHasMounted] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    // Load profile data
    loadProfile()
  }, [hasMounted, router])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        
        // For now, create a mock profile from user data
        // In a real app, you'd fetch this from the backend
        const mockProfile: UserProfile = {
          id: user.id || "1",
          firstName: user.firstName || user.name?.split(" ")[0] || "John",
          lastName: user.lastName || user.name?.split(" ")[1] || "Doe",
          email: user.email || "john@example.com",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          website: "",
          bio: "",
          avatar: "",
          preferences: {
            theme: 'system',
            language: 'en',
            notifications: {
              email: true,
              browser: true,
              marketing: false,
            },
            privacy: {
              profileVisibility: 'public',
              dataSharing: false,
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        setProfile(mockProfile)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!profile) return

    try {
      setIsLoading(true)
      
      // In a real app, you'd make an API call here
      // await apiClient.updateProfile(profile)
      
      setProfile({
        ...profile,
        updatedAt: new Date().toISOString(),
      })
      
      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      // In a real app, you'd make an API call here
      // await apiClient.updatePassword(passwordData)
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      
      // In a real app, you'd make an API call here
      // await apiClient.deleteAccount()
      
      // Clear local storage
      tokenStorage.clearAuth()
      localStorage.removeItem("resumes")
      
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
        variant: "default",
      })
      
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Error",
        description: "Failed to delete account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const resumes = localStorage.getItem("resumes")
      const userData = localStorage.getItem("user")
      
      const exportData = {
        user: userData ? JSON.parse(userData) : null,
        resumes: resumes ? JSON.parse(resumes) : [],
        exportDate: new Date().toISOString(),
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `resume-builder-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      })
    }
  }

  const logout = () => {
    tokenStorage.clearAuth()
    localStorage.removeItem("resumes")
    router.push("/")
  }

  if (!hasMounted) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900">Profile Not Found</h2>
          <p className="text-slate-600">Unable to load your profile information.</p>
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "preferences", name: "Preferences", icon: Settings },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "data", name: "Data & Privacy", icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors group bg-slate-50 hover:bg-blue-50 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900">Profile & Settings</span>
                  <Badge className="ml-3 bg-green-100 text-green-700 text-xs font-medium">Account</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={updateProfile}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-2 p-2">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-300 rounded-lg ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:scale-105"
                        }`}
                      >
                        <TabIcon className="w-5 h-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                        <User className="w-7 h-7 mr-3 text-blue-600" />
                        Personal Information
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel Edit" : "Edit Profile"}
                      </Button>
                    </div>
                    <p className="text-slate-600 mt-2">Manage your personal information and contact details.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={profile.phone || ""}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-sm font-semibold text-slate-700">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profile.location || ""}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="linkedin" className="text-sm font-semibold text-slate-700">
                          LinkedIn Profile
                        </Label>
                        <Input
                          id="linkedin"
                          value={profile.linkedin || ""}
                          onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="github" className="text-sm font-semibold text-slate-700">
                          GitHub Profile
                        </Label>
                        <Input
                          id="github"
                          value={profile.github || ""}
                          onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="website" className="text-sm font-semibold text-slate-700">
                          Personal Website
                        </Label>
                        <Input
                          id="website"
                          value={profile.website || ""}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 h-12 text-base"
                        />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="bio" className="text-sm font-semibold text-slate-700">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={profile.bio || ""}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          disabled={!isEditing}
                          className="border-slate-200 focus:border-blue-500 min-h-[120px] text-base resize-none"
                          placeholder="Tell us a bit about yourself..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                      <Palette className="w-7 h-7 mr-3 text-blue-600" />
                      Preferences
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Customize your experience and appearance.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="theme" className="text-sm font-semibold text-slate-700">
                          Theme
                        </Label>
                        <Select
                          value={profile.preferences.theme}
                          onValueChange={(value) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, theme: value as 'light' | 'dark' | 'system' }
                          })}
                        >
                          <SelectTrigger className="border-slate-200 focus:border-blue-500 h-12 text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="language" className="text-sm font-semibold text-slate-700">
                          Language
                        </Label>
                        <Select
                          value={profile.preferences.language}
                          onValueChange={(value) => setProfile({
                            ...profile,
                            preferences: { ...profile.preferences, language: value }
                          })}
                        >
                          <SelectTrigger className="border-slate-200 focus:border-blue-500 h-12 text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                      <Shield className="w-7 h-7 mr-3 text-blue-600" />
                      Security Settings
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Manage your password and account security.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="border-slate-200 focus:border-blue-500 h-12 text-base pr-12"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="border-slate-200 focus:border-blue-500 h-12 text-base"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="border-slate-200 focus:border-blue-500 h-12 text-base"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={updatePassword}
                            disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                          >
                            <Key className="w-4 h-4 mr-2" />
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
                      <AlertTriangle className="w-7 h-7 mr-3 text-red-600" />
                      Danger Zone
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Irreversible and destructive actions.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h3 className="font-semibold text-red-900">Delete Account</h3>
                        <p className="text-red-700 text-sm">Permanently delete your account and all associated data.</p>
                      </div>
                      <Button
                        onClick={deleteAccount}
                        disabled={isLoading}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                      <Bell className="w-7 h-7 mr-3 text-blue-600" />
                      Notification Preferences
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Manage how you receive notifications.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">Email Notifications</h3>
                          <p className="text-slate-600 text-sm">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.email}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: { ...profile.preferences.notifications, email: checked }
                            }
                          })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">Browser Notifications</h3>
                          <p className="text-slate-600 text-sm">Receive notifications in your browser</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.browser}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: { ...profile.preferences.notifications, browser: checked }
                            }
                          })}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">Marketing Communications</h3>
                          <p className="text-slate-600 text-sm">Receive updates about new features and offers</p>
                        </div>
                        <Switch
                          checked={profile.preferences.notifications.marketing}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              notifications: { ...profile.preferences.notifications, marketing: checked }
                            }
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data & Privacy Tab */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                      <Globe className="w-7 h-7 mr-3 text-blue-600" />
                      Data & Privacy
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Manage your data and privacy settings.</p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">Profile Visibility</h3>
                          <p className="text-slate-600 text-sm">Control who can see your profile information</p>
                        </div>
                        <Select
                          value={profile.preferences.privacy.profileVisibility}
                          onValueChange={(value) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              privacy: { ...profile.preferences.privacy, profileVisibility: value as 'public' | 'private' }
                            }
                          })}
                        >
                          <SelectTrigger className="w-48 border-slate-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900">Data Sharing</h3>
                          <p className="text-slate-600 text-sm">Allow us to use your data to improve our services</p>
                        </div>
                        <Switch
                          checked={profile.preferences.privacy.dataSharing}
                          onCheckedChange={(checked) => setProfile({
                            ...profile,
                            preferences: {
                              ...profile.preferences,
                              privacy: { ...profile.preferences.privacy, dataSharing: checked }
                            }
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                      <Download className="w-7 h-7 mr-3 text-blue-600" />
                      Data Export
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Download your data and resumes.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div>
                        <h3 className="font-semibold text-blue-900">Export Your Data</h3>
                        <p className="text-blue-700 text-sm">Download all your resumes and account data as JSON.</p>
                      </div>
                      <Button
                        onClick={exportData}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                      <LogOut className="w-7 h-7 mr-3 text-blue-600" />
                      Account Actions
                    </CardTitle>
                    <p className="text-slate-600 mt-2">Manage your account session.</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div>
                        <h3 className="font-semibold text-orange-900">Sign Out</h3>
                        <p className="text-orange-700 text-sm">Sign out of your account on this device.</p>
                      </div>
                      <Button
                        onClick={logout}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 