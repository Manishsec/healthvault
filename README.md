# 🏥 HealthVault - Medical Records Management System

A modern, secure healthcare management platform built with Next.js, IndexDB, and AI-powered features.

![HealthVault](https://img.shields.io/badge/HealthVault-v2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![IndexDB](https://img.shields.io/badge/IndexDB-Powered-green)

## ✨ Features

- 🔐 **Secure Authentication** with OTP-based login
- 👥 **Multi-role Support** (Patients & Doctors)
- 📱 **Responsive Design** for all devices
- 🤖 **AI-Powered Chat** using Google Gemini
- 📋 **Appointment Management** system
- 📊 **Medical Records** storage and retrieval
- 🔔 **Real-time Notifications**
- 🎨 **Modern UI** with Tailwind CSS and shadcn/ui

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd healthvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_secure_jwt_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and log in
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set Environment Variables in Vercel**
   During deployment, Vercel will prompt you to set environment variables:

   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_GEMINI_API_KEY` | Your Google Gemini API key |
   | `JWT_SECRET` | Your secure JWT secret key for authentication |

   If you skip this step during initial setup, you can add them later in your project's settings.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🏗️ Project Structure

```
healthvault/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── patient/           # Patient dashboard
│   ├── doctor/            # Doctor dashboard
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utilities and configuration
│   ├── database.ts      # IndexDB database setup and models
│   ├── auth.ts          # Authentication service using IndexDB 
│   └── utils.ts          # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `JWT_SECRET` | ✅ | JWT secret key for token signing/verification |
| `NODE_ENV` | ❌ | Environment (development/production) |

### Demo Accounts

For testing purposes, use these credentials:

- **Doctor Account**: `9876543210` (OTP: `123456`)
- **Patient Account**: Any other number (OTP: `123456`)

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run build-check  # Full pre-deployment check
```

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling

## 🔒 Security

- Environment variables validation
- Secure API key handling
- JWT-based authentication with secure token storage
- OTP-based verification for login and registration
- Input sanitization and validation
- HTTPS enforcement in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Deployment Guide](./DEPLOYMENT.md)
2. Verify environment variables are set correctly
3. Check Vercel deployment logs
4. Ensure all dependencies are installed

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [IndexedDB Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Dexie.js Documentation](https://dexie.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

Made with ❤️ for better healthcare management
