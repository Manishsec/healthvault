// Enhanced email service with fallback mechanisms
interface EmailJSLib {
  init: (publicKey: string) => void
  send: (serviceId: string, templateId: string, params: Record<string, any>) => Promise<EmailJSResponse>
}

interface EmailJSResponse {
  status: number
  text: string
}

declare global {
  interface Window {
    emailjs: EmailJSLib;
  }
}

interface EmailConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

class EnhancedEmailService {
  private config: EmailConfig
  private isInitialized: boolean = false
  private initPromise: Promise<boolean> | null = null

  constructor() {
    this.config = {
      serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_a71xr7g',
      templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_dknhziq',
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'aCOiYJ-WKhyYTHrVr'
    }
  }

  private async loadEmailJS(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    // Check if EmailJS is already loaded
    if (window.emailjs) {
      this.isInitialized = true
      return true
    }

    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
      script.async = true
      
      script.onload = () => {
        try {
          if (window.emailjs) {
            window.emailjs.init(this.config.publicKey)
            this.isInitialized = true
            console.log('✅ EmailJS loaded and initialized successfully')
            resolve(true)
          } else {
            console.error('❌ EmailJS failed to load properly')
            resolve(false)
          }
        } catch (error) {
          console.error('❌ EmailJS initialization error:', error)
          resolve(false)
        }
      }

      script.onerror = () => {
        console.error('❌ Failed to load EmailJS script')
        resolve(false)
      }

      document.head.appendChild(script)
    })
  }

  private async ensureInitialized(): Promise<boolean> {
    if (this.isInitialized && window.emailjs) {
      return true
    }

    // If already initializing, wait for it
    if (this.initPromise) {
      return await this.initPromise
    }

    // Start initialization
    this.initPromise = this.loadEmailJS()
    const result = await this.initPromise
    this.initPromise = null
    
    return result
  }

  async sendOTP(email: string, otp: string, purpose: 'registration' | 'login' | 'reset' = 'login'): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`📧 Attempting to send ${purpose} OTP to:`, email)

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address.'
        }
      }

      // Ensure EmailJS is initialized
      const initialized = await this.ensureInitialized()
      if (!initialized) {
        console.error('❌ EmailJS initialization failed')
        return {
          success: false,
          message: 'Email service is temporarily unavailable. Please try again in a moment.'
        }
      }

      // Verify configuration
      if (!this.config.serviceId || !this.config.templateId || !this.config.publicKey) {
        console.error('❌ EmailJS configuration incomplete:', {
          serviceId: !!this.config.serviceId,
          templateId: !!this.config.templateId,
          publicKey: !!this.config.publicKey
        })
        return {
          success: false,
          message: 'Email service configuration error. Please contact support.'
        }
      }

      // Email content based on purpose
      const getEmailContent = (purpose: string) => {
        switch (purpose) {
          case 'registration':
            return {
              subject: 'Verify Your HealthVault Account',
              title: 'Welcome to HealthVault! 🏥',
              message: 'Thank you for registering with HealthVault. To complete your registration and secure your account, please verify your email address using the verification code below:',
              footer: 'This code will expire in 10 minutes for security reasons.',
              backgroundColor: '#059669'
            }
          case 'login':
            return {
              subject: 'Your HealthVault Login Code',
              title: 'Secure Login Verification 🔐',
              message: 'Someone is trying to sign in to your HealthVault account. If this was you, please use the verification code below to complete the login:',
              footer: 'If you did not request this code, please ignore this email.',
              backgroundColor: '#059669'
            }
          case 'reset':
            return {
              subject: 'Reset Your HealthVault Password',
              title: 'Password Reset Request 🔑',
              message: 'You requested to reset your HealthVault password. Use the verification code below to proceed with the password reset:',
              footer: 'This code will expire in 10 minutes. If you did not request this, please ignore this email.',
              backgroundColor: '#dc2626'
            }
          default:
            return {
              subject: 'HealthVault Verification Code',
              title: 'Email Verification 📧',
              message: 'Your HealthVault verification code is:',
              footer: 'This code will expire in 10 minutes.',
              backgroundColor: '#059669'
            }
        }
      }

      const content = getEmailContent(purpose)
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      const templateParams = {
        to_email: email,
        to_name: email.split('@')[0],
        subject: content.subject,
        title: content.title,
        message: content.message,
        otp_code: otp,
        footer_message: content.footer,
        current_date: currentDate,
        app_name: 'HealthVault',
        app_url: process.env.NEXT_PUBLIC_APP_URL || 'https://healthvault.vercel.app',
        support_email: 'support@healthvault.com',
        background_color: content.backgroundColor
      }

      console.log('📧 Sending email with parameters:', {
        serviceId: this.config.serviceId,
        templateId: this.config.templateId,
        to_email: email,
        subject: content.subject
      })

      // Send email with retry mechanism
      let lastError: any = null
      const maxRetries = 3
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`📧 Sending attempt ${attempt}/${maxRetries}...`)
          
          const response = await window.emailjs.send(
            this.config.serviceId,
            this.config.templateId,
            templateParams
          )

          if (response.status === 200) {
            console.log('✅ Email sent successfully:', response)
            return {
              success: true,
              message: 'Verification code sent successfully! Please check your email.'
            }
          } else {
            throw new Error(`EmailJS returned status: ${response.status}`)
          }
        } catch (error: any) {
          lastError = error
          console.warn(`⚠️ Attempt ${attempt} failed:`, error)
          
          if (attempt < maxRetries) {
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, attempt * 1000))
          }
        }
      }

      // All retries failed
      console.error('❌ All email sending attempts failed:', lastError)
      return {
        success: false,
        message: 'Failed to send verification email. Please check your email address and try again.'
      }

    } catch (error: any) {
      console.error('❌ Email service error:', error)
      return {
        success: false,
        message: 'Email service error. Please try again or contact support.'
      }
    }
  }

  // Test email configuration
  async testConfiguration(): Promise<{ success: boolean; message: string }> {
    try {
      const initialized = await this.ensureInitialized()
      if (!initialized) {
        return {
          success: false,
          message: 'EmailJS failed to initialize'
        }
      }

      return {
        success: true,
        message: 'Email service is configured correctly'
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Configuration test failed: ${error.message}`
      }
    }
  }
}

// Export singleton instance
export const emailService = new EnhancedEmailService()

// For backward compatibility
export default emailService
