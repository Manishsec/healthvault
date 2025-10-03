// Environment variable validation and configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'JWT_SECRET'
] as const

type EnvVar = typeof requiredEnvVars[number]

interface AppConfig {
  gemini: {
    apiKey: string
  }
  jwt: {
    secret: string
  }
  isDevelopment: boolean
  isProduction: boolean
}

function validateEnvVar(name: EnvVar): string {
  const value = process.env[name]
  
  if (!value) {
    console.error(`❌ Missing required environment variable: ${name}`)
    
    if (typeof window === 'undefined') {
      // Server-side: log error but don't throw to prevent build failure
      console.warn(`⚠️ Missing environment variable: ${name}`)
      return ''
    } else {
      // Client-side: show user-friendly error
      console.warn(`⚠️ App may not function properly without ${name}`)
      return ''
    }
  }
  
  return value
}

// Validate all required environment variables
const config: AppConfig = {
  gemini: {
    apiKey: validateEnvVar('NEXT_PUBLIC_GEMINI_API_KEY'),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'healthvault-secure-jwt-secret-key-2024-production',
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Log configuration status (without sensitive data) only in development
if (typeof window === 'undefined' && config.isDevelopment) {
  console.log('🔧 Environment Configuration:')
  console.log(`   - Environment: ${process.env.NODE_ENV}`)
  console.log(`   - JWT Secret: ${config.jwt.secret ? '✅ Set' : '❌ Missing'}`)
  console.log(`   - Gemini API: ${config.gemini.apiKey ? '✅ Set' : '❌ Missing'}`)
}

export default config
