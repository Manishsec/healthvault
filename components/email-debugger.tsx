"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { emailService } from "@/lib/email-service-enhanced"
import { TestTube, Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function EmailServiceDebugger() {
  const [testEmail, setTestEmail] = useState("")
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [configTest, setConfigTest] = useState<{ success: boolean; message: string } | null>(null)

  const testConfiguration = async () => {
    setIsLoading(true)
    try {
      const result = await emailService.testConfiguration()
      setConfigTest(result)
      console.log('Email service configuration test:', result)
    } catch (error: any) {
      setConfigTest({
        success: false,
        message: `Test failed: ${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    if (!testEmail) {
      setTestResult({
        success: false,
        message: "Please enter an email address"
      })
      return
    }

    setIsLoading(true)
    setTestResult(null)
    
    try {
      const otp = "123456" // Test OTP
      const result = await emailService.sendOTP(testEmail, otp, 'login')
      setTestResult(result)
      console.log('Test email result:', result)
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Test failed: ${error.message}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Email Service Debug
        </CardTitle>
        <CardDescription>
          Test email service configuration and functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Test */}
        <div>
          <Button 
            onClick={testConfiguration} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Configuration"}
          </Button>
          
          {configTest && (
            <div className="mt-2 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {configTest.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge variant={configTest.success ? "default" : "destructive"}>
                  {configTest.success ? "Success" : "Failed"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {configTest.message}
              </p>
            </div>
          )}
        </div>

        {/* Email Test */}
        <div>
          <Input
            type="email"
            placeholder="Enter test email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          
          <Button 
            onClick={sendTestEmail} 
            disabled={isLoading || !testEmail}
            className="w-full mt-2"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isLoading ? "Sending..." : "Send Test Email"}
          </Button>
          
          {testResult && (
            <div className="mt-2 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? "Success" : "Failed"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {testResult.message}
              </p>
            </div>
          )}
        </div>

        {/* Environment Info */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1 mb-1">
            <AlertCircle className="w-3 h-3" />
            <span>Environment Info:</span>
          </div>
          <div>Service ID: {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "✅ Set" : "❌ Missing"}</div>
          <div>Template ID: {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? "✅ Set" : "❌ Missing"}</div>
          <div>Public Key: {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "✅ Set" : "❌ Missing"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
