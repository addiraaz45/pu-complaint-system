"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import LoginPage from "@/components/login-page"
import StudentDashboard from "@/components/student-dashboard"
import RectorDashboard from "@/components/rector-dashboard"
import { AuthProvider, useAuth } from "@/context/auth-context"
import { ComplaintProvider } from "@/context/complaint-context"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="hostel-theme">
      <AuthProvider>
        <ComplaintProvider>
          <AppContent />
        </ComplaintProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function AppContent() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Initialize the app with sample data if needed
    if (typeof window !== "undefined" && !localStorage.getItem("complaints")) {
      localStorage.setItem("complaints", JSON.stringify([]))
    }
  }, [])

  if (!user) {
    return <LoginPage />
  }

  return user.role === "student" ? <StudentDashboard /> : <RectorDashboard />
}

