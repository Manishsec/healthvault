"use client"

import type React from "react"

import { authService, UserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [userType, setUserType] = useState<UserRole>("patient")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [otp, setOtp] = useState("")
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Basic validation
      if (!email || !fullName || !phone) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }

      // Create user profile based on user type
      let additionalProfile = {}
      
      if (userType === 'patient') {
        additionalProfile = {
          dateOfBirth: '',
          gender: '',
          address: '',
          emergencyContact: '',
          emergencyPhone: '',
        }
      } else {
        additionalProfile = {
          specialty: '',
          licenseNumber: '',
          experience: 0,
          qualifications: [],
          clinicName: '',
          clinicAddress: '',
          consultationFee: 0,
          languages: [],
        }
      }

      const result = await authService.registerUser(
        email, 
        fullName,
        userType, 
        { phone, ...additionalProfile }
      )

      if (result.success && result.requiresOTP) {
        setRegistrationComplete(true)
      } else if (!result.success) {
        setError(result.message)
      }
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await authService.verifyRegistration(email, otp)
      
      if (result.success) {
        router.push("/auth/sign-up-success")
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Join HealthVault</CardTitle>
              <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent>
              {!registrationComplete ? (
                <form onSubmit={handleSignUp}>
                  <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="userType">I am a</Label>
                      <div className="relative">
                        <div className="border rounded-md flex items-center p-2 pr-3 justify-between bg-background">
                          <div className="flex items-center gap-2">
                            {userType === "patient" ? (
                              <>
                                <User className="h-4 w-4" />
                                <span className="font-medium">Patient</span>
                              </>
                            ) : (
                              <>
                                <Stethoscope className="h-4 w-4" />
                                <span className="font-medium">Doctor</span>
                              </>
                            )}
                          </div>
                          <button
                            type="button"
                            className="text-xs h-auto py-1 px-2 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer hover:bg-transparent hover:underline"
                            onClick={() => setUserType(userType === "patient" ? "doctor" : "patient")}
                          >
                            Click to switch
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Sign up"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <div className="flex flex-col gap-4">
                    <p className="text-sm">
                      We've sent a verification code to your email. Please check your inbox and enter the code below.
                    </p>
                    <div className="grid gap-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify Account"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
