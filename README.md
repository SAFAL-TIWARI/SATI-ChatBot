# SATI ChatBot - Your Institute Guide

Modern AI chatbot for Samrat Ashok Technological Institute (SATI) with dual AI providers, academic resources hub, user authentication, and advanced UI features.

## ✨ Features

- 🤖 **Dual AI Support**: Google Gemini & Groq APIs with serverless functions
- 🔐 **User Authentication**: Google & GitHub sign-in with Supabase
- 📖 **Resources Hub**: Notes, assignments, test papers, syllabus & PYQs with PDF preview
- 💾 **Chat Management**: Save, bookmark, search, and organize conversations
- 🎨 **Modern UI**: Dark/light themes with smooth animations
- 📚 **SATI Knowledge**: Comprehensive institute information
- 🔧 **Model Switching**: Dynamic AI model selection
- 🌐 **SEO Optimized**: Complete meta tags, sitemap, robots.txt
- 📱 **PWA Ready**: Mobile-responsive with app-like experience

## 🚀 Quick Start

### Local Development
```bash
# Clone repository
git clone https://github.com/SAFAL-TIWARI/SATI-ChatBot.git
cd SATI-ChatBot

# Run locally
npm start
# Opens at http://localhost:8000
```

### Environment Setup
Create `.env.local` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get API keys from:
- [Google AI Studio](https://aistudio.google.com/) (Gemini)
- [Groq Console](https://console.groq.com/) (Groq)
- [Supabase](https://supabase.com/) (Authentication & Database)

## 📁 Project Structure

```
SATI-ChatBot/
├── index.html          # Main chatbot interface
├── resources.html      # Academic resources page
├── about.html         # About page
├── contact.html       # Contact page
├── privacy-policy.html # Privacy policy page
├── terms-of-service.html # Terms of service page
├── 404.html           # Custom 404 error page
├── styles.css         # Main styling
├── script.js          # Core chatbot functionality
├── api-integration.js # Frontend API management
├── sati-knowledge.js  # Institute knowledge base
├── supabase-db.js     # Database operations
├── cool-mode.js       # Particle animation effects
├── smooth-cursor.js   # Smooth cursor animations
├── config.js          # Configuration
├── sitemap.xml        # SEO sitemap
├── robots.txt         # Search engine directives
├── ads.txt            # Ad network verification
├── api/               # Serverless functions
│   ├── gemini.js      # Gemini API endpoint
│   ├── groq.js        # Groq API endpoint
│   └── supabase-config.js # Database configuration
└── images/            # Assets and icons
```

## 🔧 Supported Models

**Google Gemini**: `gemini-1.5-flash`, `gemini-1.5-pro`  
**Groq**: `llama-3.1-8b-instant`, `llama-3.3-70b-versatile`, `gemma2-9b-it`, `deepseek-r1-distill-llama-70b`

## 🎯 Key Features Detail

### Authentication & User Management
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account  
- **User Profiles**: Personalized experience with profile management
- **Session Management**: Secure authentication with Supabase

### Chat Management
- **Conversation History**: Persistent chat storage
- **Bookmark System**: Save important conversations
- **Search Functionality**: Find conversations quickly
- **Export Options**: Download chat history
- **Conversation Organization**: Rename and categorize chats

### Resources Hub
- **PDF Preview**: View documents directly in browser
- **Download Support**: One-click download functionality
- **Branch-wise Organization**: Resources by department (CSE, ECE, ME, EE, CE, IoT, IT, BCT, AIADS, AIAML)
- **Search & Filter**: Find specific resources quickly
- **Mobile Responsive**: Access on any device

### SEO & Performance
- **Complete Meta Tags**: Open Graph, Twitter Cards, structured data
- **XML Sitemap**: Search engine optimization
- **Robots.txt**: Crawler directives
- **404 Error Page**: Custom error handling
- **Privacy Policy & Terms**: Legal compliance pages

## 🌐 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Deploy automatically

### Manual Deployment
```bash
npm install -g vercel
vercel --prod
```

### Other Platforms
- **Netlify**: Supports serverless functions
- **Railway**: Direct deployment with environment variables
- **Render**: Static site with serverless functions

## 👥 Team FluxoNauts

Built for FluxWave Hackathon by Flux Club, [SATI Vidisha](https://satiengg.in/)

**Team Members:**
- [Safal Tiwari](https://github.com/SAFAL-TIWARI)
- [Utkarsh Vishwakarma](https://github.com/UtkiVish)  
- [Aashutosh Singh Baghel](https://github.com/thunder-thigh)
- [Hardik Kumar Sinha](https://github.com/HKSinha510)

## 🌐 Live Demo

**Application**: [https://sati-chatbot.vercel.app/](https://sati-chatbot.vercel.app/)

## 🧹 Supabase Storage Auto-Cleanup

**Repository**: [https://github.com/UtkiVish/supabase_cleaning.git](https://github.com/UtkiVish/supabase_cleaning.git)

Automated Node.js script with GitHub Actions that cleans up user-uploaded files from Supabase Storage every 5 minutes to manage storage costs and maintain privacy.

**Sub-Repo Author**: [Utkarsh Vishwakarma](https://github.com/UtkiVish)

## 📄 License

MIT License

---
<div align="center">
<b>Built with ❤️ by Team FluxoNauts for FluxWave Hackathon</b>
</div>