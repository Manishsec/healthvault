"use client"

import { EmailServiceDebugger } from "@/components/email-debugger"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bug, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function DebugPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Bug className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Email Service Debug</h1>
              </div>
              <p className="text-muted-foreground">
                Test and troubleshoot email verification functionality
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Debug Component */}
            <div>
              <EmailServiceDebugger />
            </div>

            {/* Information Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Issues & Solutions</CardTitle>
                  <CardDescription>
                    Troubleshooting guide for email verification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Email Not Received
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• Check spam/junk folder</li>
                      <li>• Verify email address is correct</li>
                      <li>• Try with a different email provider (Gmail, Outlook)</li>
                      <li>• Wait 2-3 minutes for delivery</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Configuration Errors
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• EmailJS service credentials missing</li>
                      <li>• Network connectivity issues</li>
                      <li>• Browser blocking third-party scripts</li>
                      <li>• Template configuration problems</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Quick Fixes
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      <li>• Refresh the page and try again</li>
                      <li>• Disable ad blockers temporarily</li>
                      <li>• Try incognito/private browsing mode</li>
                      <li>• Use the debug tool above to test</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environment Status</CardTitle>
                  <CardDescription>
                    Current configuration status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">EmailJS Service ID</span>
                      <Badge variant={process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">EmailJS Template ID</span>
                      <Badge variant={process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">EmailJS Public Key</span>
                      <Badge variant={process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "default" : "destructive"}>
                        {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Environment</span>
                      <Badge variant="outline">
                        {process.env.NODE_ENV || "development"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>
                    If the debug tool shows configuration errors or emails still aren&apos;t working,
                    this indicates an issue with the EmailJS setup that needs to be resolved in 
                    the deployment environment variables.
                  </p>
                  <p className="mt-2">
                    For production deployment, ensure all EmailJS credentials are properly 
                    set in your Vercel environment variables.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
