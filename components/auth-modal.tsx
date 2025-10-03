"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Shield, CheckCircle, ArrowLeft, UserPlus, LogIn, User, Stethoscope } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "login" | "register"
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [step, setStep] = useState<"form" | "otp">("form")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  
  // Registration form state
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"patient" | "doctor">("patient")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [address, setAddress] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [experience, setExperience] = useState("")

  const { user: authUser, registerUser, verifyRegistration, sendOTP, verifyOTPAndLogin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const resetForm = () => {
    setStep("form")
    setEmail("")
    setOtp("")
    setFullName("")
    setPhone("")
    setDateOfBirth("")
    setAddress("")
    setSpecialization("")
    setLicenseNumber("")
    setExperience("")
    setTimer(0)
  }

  const handleSendOTP = async (isLogin = false) => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!isLogin && !fullName) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (!isLogin) {
        // Registration flow
        const profile = role === "patient" 
          ? { 
              fullName,
              phone, 
              dateOfBirth, 
              gender: 'other' as const,
              address,
              emergencyContact: '',
              emergencyPhone: ''
            }
          : { 
              fullName,
              phone, 
              specialty: specialization,
              licenseNumber, 
              experience: parseInt(experience) || 0,
              qualifications: [],
              clinicName: '',
              clinicAddress: '',
              consultationFee: 0,
              languages: []
            }

        const result = await registerUser(email, fullName, role, profile)
        
        if (!result.success) {
          toast({
            title: "Registration Failed",
            description: result.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        
        toast({
          title: "Registration Successful! 📧",
          description: "Please check your email for the verification code.",
        })
      } else {
        // Login flow
        const result = await sendOTP(email)
        
        if (!result.success) {
          // Provide more helpful error messages
          let errorMessage = result.message
          if (result.message.includes('Email service')) {
            errorMessage = "Email verification is temporarily unavailable. Please try again in a moment or check our debug page for more information."
          } else if (result.message.includes('configuration')) {
            errorMessage = "There's a configuration issue. Please try again or contact support."
          }
          
          toast({
            title: "Cannot Send Verification Code",
            description: errorMessage,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        
        toast({
          title: "OTP Sent! 📧",
          description: "Please check your email for the verification code.",
        })
      }

      setStep("otp")
      setTimer(60) // 60 second timer
      
      // Start countdown
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Check if this is registration or login
      const isRegistration = activeTab === "register"
      
      if (isRegistration) {
        // For registration, verify the OTP and auto-login
        const result = await verifyRegistration(email, otp)
        
        if (result.success) {
          // Registration verified and user is automatically logged in!
          toast({
            title: "Welcome to HealthVault! 🎉",
            description: "Registration successful! Redirecting to your dashboard...",
          })
          
          onOpenChange(false)
          resetForm()
          
          // Redirect based on actual user role from registration
          setTimeout(() => {
            const dashboardPath = role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
            router.push(dashboardPath)
          }, 1000)
        } else {
          toast({
            title: "Invalid OTP",
            description: result.message,
            variant: "destructive",
          })
        }
      } else {
        // For login, verify the login OTP
        const result = await verifyOTPAndLogin(email, otp)
        
        if (result.success) {
          toast({
            title: "Welcome to HealthVault! 🎉",
            description: "Authentication successful. Redirecting to your dashboard...",
          })
          
          onOpenChange(false)
          resetForm()
          
          // Wait a bit for auth context to update, then redirect based on user role
          setTimeout(() => {
            // Check auth context for user role, or fetch from database
            if (authUser) {
              const dashboardPath = authUser.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
              router.push(dashboardPath)
            } else {
              // Fallback to patient dashboard if user not yet in context
              router.push("/patient/dashboard")
            }
          }, 1000)
        } else {
          toast({
            title: "Invalid OTP",
            description: result.message,
            variant: "destructive",
          })
        }
      }
    } catch {
      toast({
        title: "Verification Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = () => {
    if (timer === 0) {
      handleSendOTP(activeTab === "login")
    }
  }

  const handleBackToForm = () => {
    setStep("form")
    setOtp("")
    setTimer(0)
  }

  if (step === "otp") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg mx-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            
            <DialogTitle className="text-center text-xl sm:text-2xl font-bold">
              Check Your Email
            </DialogTitle>
            
            <DialogDescription className="text-center text-sm sm:text-base px-2">
              We sent a {activeTab === "register" ? "registration" : "login"} verification code to<br />
              <span className="font-medium text-foreground break-all">{email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-2 sm:px-0">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm sm:text-base">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-base sm:text-lg tracking-widest h-12 sm:h-auto"
                maxLength={6}
              />
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length !== 6}
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Code
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToForm}
                className="p-0 h-auto"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendOTP}
                disabled={timer > 0}
                className="p-0 h-auto"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to HealthVault
          </DialogTitle>
          
          <DialogDescription className="text-center">
            Your secure health management platform
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={() => handleSendOTP(true)}
              disabled={isLoading || !email}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Login Code
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>                <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <div className="relative">
                  <div className="border rounded-md flex items-center p-2 pr-3 justify-between bg-background">
                    <div className="flex items-center gap-2">
                      {role === "patient" ? (
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
                      onClick={() => {
                        // Simple toggle between patient and doctor
                        setRole(role === "patient" ? "doctor" : "patient")
                      }}
                    >
                      Click to switch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email Address</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {role === "patient" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="e.g., Cardiology"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="e.g., 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter medical license number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              onClick={() => handleSendOTP(false)}
              disabled={isLoading || !email || !fullName}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
