"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService, type AuthUser, type UserRole } from "@/lib/auth"
import { emailService } from "@/lib/email-service-enhanced"
import type { PatientProfile, DoctorProfile } from "@/lib/database"

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  // Registration methods
  registerUser: (email: string, fullName: string, role: UserRole, profile: PatientProfile | DoctorProfile) => Promise<{ success: boolean; message: string }>
  verifyRegistration: (email: string, otp: string) => Promise<{ success: boolean; message: string }>
  // OTP methods
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>
  verifyOTPAndLogin: (email: string, otp: string) => Promise<{ success: boolean; message: string }>
  // Session management
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  // Profile management
  updateProfile: (updates: Partial<PatientProfile | DoctorProfile>) => Promise<{ success: boolean; message: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const registerUser = async (email: string, fullName: string, role: UserRole, profile: PatientProfile | DoctorProfile) => {
    try {
      const result = await authService.registerUser(email, fullName, role, profile)
      return result
    } catch (err) {
      console.error("Registration error:", err)
      return { success: false, message: "Registration failed. Please try again." }
    }
  }

  const verifyRegistration = async (email: string, otp: string) => {
    try {
      const result = await authService.verifyRegistration(email, otp)
      // If registration verification successful, user is auto-logged in
      if (result.success && result.user && result.token) {
        setUser(result.user)
        localStorage.setItem('healthvault_token', result.token)
      }
      return result
    } catch (error) {
      console.error("Verify registration error:", error)
      return { success: false, message: "Verification failed. Please try again." }
    }
  }

  const sendOTP = async (email: string) => {
    try {
      // First try the enhanced email service directly
      console.log('🔄 Attempting to send OTP via enhanced email service...')
      
      // Test email service configuration
      const configTest = await emailService.testConfiguration()
      console.log('📧 Email service test:', configTest)
      
      if (!configTest.success) {
        console.warn('⚠️ Email service configuration issue:', configTest.message)
      }

      const result = await authService.sendOTP(email)
      
      if (!result.success) {
        console.warn('⚠️ Auth service sendOTP failed, trying fallback API...')
        
        // Fallback to API route
        try {
          const response = await fetch('/api/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, purpose: 'login' }),
          })

          const apiResult = await response.json()
          console.log('📧 API fallback result:', apiResult)
          
          if (apiResult.success) {
            return { success: true, message: 'Verification code sent successfully!' }
          } else {
            return { success: false, message: apiResult.message || 'Failed to send verification code.' }
          }
        } catch (apiError) {
          console.error('❌ API fallback failed:', apiError)
          return { success: false, message: 'Email service temporarily unavailable.' }
        }
      }
      
      return result
    } catch (error) {
      console.error("❌ Send OTP error:", error)
      return { success: false, message: "Failed to send verification code. Please check your email address." }
    }
  }

  const verifyOTPAndLogin = async (email: string, otp: string) => {
    try {
      const result = await authService.verifyOTPAndLogin(email, otp)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Login failed. Please try again." }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const refreshSession = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Refresh session error:", error)
      setUser(null)
    }
  }

  const updateProfile = async (updates: Partial<PatientProfile | DoctorProfile>) => {
    try {
      if (!user?.id) {
        return { success: false, message: "No user logged in" }
      }
      
      const result = await authService.updateProfile(user.id, updates)
      if (result.success) {
        // Refresh user data
        await refreshSession()
      }
      return result
    } catch (error) {
      console.error("Update profile error:", error)
      return { success: false, message: "Failed to update profile. Please try again." }
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        registerUser, 
        verifyRegistration,
        sendOTP, 
        verifyOTPAndLogin, 
        logout, 
        refreshSession, 
        updateProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
