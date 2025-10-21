# SATI ChatBot 🤖

> Modern AI-powered chatbot for Samrat Ashok Technological Institute (SATI) with dual AI providers, comprehensive academic resources, interactive code editor, and seamless user experience across web and mobile platforms.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://sati-chatbot.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

## ✨ Key Features

- 🤖 **Dual AI Integration** - Google Gemini & Groq APIs with smart model switching
- 🔐 **Secure Authentication** - Google & GitHub OAuth with Supabase backend
- 📚 **Academic Resources Hub** - Branch-wise notes, assignments, PYQs with PDF preview & download
- 🧑🏻‍💻 **Interactive Code Editor** - Multi-language programming environment with live compilation
- 💬 **Smart Chat Management** - Save, bookmark, search, and export conversations
- 🎨 **Modern UI/UX** - Dark/light themes, smooth animations, cool mode effects
- 💻 **Cross-Platform** - Web app + Android WebView application

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/SAFAL-TIWARI/SATI-ChatBot.git
cd SATI-ChatBot
npm start
```

**Environment Variables** (`.env.local`):
```env
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

Get keys from: [Google AI Studio](https://aistudio.google.com/) • [Groq Console](https://console.groq.com/) • [Supabase](https://supabase.com/)

## 🏗️ Tech Stack

**Frontend**: Vanilla JavaScript, HTML5, CSS3  
**Backend**: Node.js Serverless Functions (Vercel)  
**Database**: Supabase (PostgreSQL)  
**AI Models**: Gemini 2.5 Flash/Pro, Llama 3.1/3.3, DeepSeek  
**Authentication**: OAuth (Google, GitHub)  
**Mobile**: Android WebView App

## 📁 Core Structure

```
├── index.html                    # Main chatbot interface
├── about.html                    # Team and project information
├── contact.html                  # Contact form and support
├── privacy-policy.html           # Privacy policy and data protection
├── terms-of-service.html         # Terms of service and user agreement
├── offline.html                  # PWA offline fallback page
├── script.js                     # Core chatbot functionality
├── api-integration.js            # AI provider management
├── sati-knowledge.js             # Institute knowledge base
├── supabase-db.js                # Database operations
├── manifest.json                 # PWA configuration
├── api/                          # Serverless functions
│   ├── gemini.js                # Gemini API endpoint
│   ├── groq.js                  # Groq API endpoint
│   └── supabase-config.js       # Database configuration
├── android/                      # Android WebView app
├── resources/                    # Academic materials & programming
│   ├── materials/               # Branch-wise academic resources
│   │   ├── 2nd-year/           # Second year materials
│   └── programming/             # Interactive code editor
└── /assets/                       # Icons, logos, and visual assets
```

## 🚀 Deployment

**One-Click Deploy to Vercel:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SAFAL-TIWARI/SATI-ChatBot)

**Manual Deployment:**
```bash
npm install -g vercel
vercel --prod
```

**Alternative Platforms:** Netlify, Railway, Render

## 📱 Android App

**Current Status:** 🚧 Work in Progress
- Native API handling without browser redirects
- File attachment support
- Integrated SSO login

**Build Instructions:**
```bash
cd android
./gradlew assembleDebug    # Debug APK
./gradlew assembleRelease  # Release APK
```

**Requirements:** Android 11+ (API 30), Java, Gradle

## 👥 Team FluxoNauts

| Member | Role | GitHub |
|--------|------|--------|
| **Safal Tiwari** | Frontend & Architecture | [@SAFAL-TIWARI](https://github.com/SAFAL-TIWARI) |
| **Utkarsh Vishwakarma** | Backend & DevOps | [@UtkiVish](https://github.com/UtkiVish) |
| **Aashutosh Singh Baghel** | UI/UX & Android | [@thunder-thigh](https://github.com/thunder-thigh) |
| **Hardik Kumar Sinha** | QA & Documentation | [@HKSinha510](https://github.com/HKSinha510) |


## 🌐 Live Demo

**Web Application**: [https://sati-chatbot.vercel.app/](https://sati-chatbot.vercel.app/)  
**Android App**: Available in the `android/` directory - build locally or download APK from releases

## 🧹 Supabase Storage Auto-Cleanup

**Repository**: [https://github.com/UtkiVish/supabase_cleaning.git](https://github.com/UtkiVish/supabase_cleaning.git)

Automated Node.js script with GitHub Actions that cleans up user-uploaded files from Supabase Storage every 5 minutes to manage storage costs and maintain privacy.

**Sub-Repo Author**: [Utkarsh Vishwakarma](https://github.com/UtkiVish)

## 📄 License

MIT License

---
<div align="center">
<b>Built with ❤️ by Team FluxoNauts</b>
</div>