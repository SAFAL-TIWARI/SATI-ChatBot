# SATI ChatBot - Your Institute Guide

A modern web-based AI chatbot for Samrat Ashok Technological Institute (SATI) with hybrid API support, secure key management, and comprehensive academic resources hub. Features dual AI providers (Google Gemini & Groq), real-time chat interface, and extensive collection of study materials including notes, assignments, test papers, syllabus, and PYQs for all departments.

## Features

- 🤖 **Dual AI Support**: Google Gemini & Groq cloud APIs
- 📖 **Resources Hub**: Access to notes, assignments, test papers, syllabus & PYQs
- 🔐 **Secure API Keys**: Client-side encrypted key storage
- 💬 **Real-time Chat**: Interactive interface with typing indicators
- 🎨 **Modern UI**: Dark/light themes with responsive design
- 💾 **Chat History**: Persistent conversation storage
- 📚 **SATI Knowledge**: Comprehensive institute information
- 🔧 **Model Switching**: Dynamic AI model selection

## Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/SAFAL-TIWARI/SATI-ChatBot/
cd SATI-ChatBot
npm run setup  # Generates secure API key storage
```

### 2. Configure API Keys
Run the setup and add your API keys:
- **Google Gemini**: Get from [Google AI Studio](https://aistudio.google.com/)
- **Groq**: Get from [Groq Console](https://console.groq.com/)

### 3. Run Locally
```bash
npm run serve
# Opens at http://localhost:8000
```

## Deployment

### GitHub Pages (Recommended)
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Configure API keys in the web interface

### Other Platforms
- **Netlify**: Drag & drop deployment
- **Vercel**: Connect GitHub repository
- **Any static hosting**: Upload all files

## File Structure

```
SATI-ChatBot/
├── index.html           # Main chatbot application
├── resources.html       # Academic resources page
├── script.js           # Core chatbot functionality
├── resources.js        # Resources page functionality
├── api-integration.js  # API management
├── styles.css          # Main UI styling
├── resources.css       # Resources page styling
├── sati-knowledge.js   # Institute data & knowledge base
├── config.js           # Configuration & API keys
├── generate-api-keys.js # API key encryption utility
├── package.json        # Project metadata
└── images/             # Assets and icons
```

## API Keys Setup

The application uses secure client-side encryption for API keys:
1. Run `npm run setup` to generate encryption keys
2. Add your API keys through the web interface
3. Keys are encrypted and stored locally

## Supported Models

- **Google Gemini**: gemini-1.5-flash, gemini-1.5-pro
- **Groq**: llama-3.1-8b-instant, llama-3.3-70b-versatile, gemma2-9b-it, deepseek-r1-distill-llama-70b, llama3-8b-8192, llama3-70b-8192

## Resources Hub

Access comprehensive academic resources through the dedicated resources page:

### Available Resources
- **📝 Notes**: Handwritten and faculty-prepared notes for various subjects
- **💻 Practical Assignments**: Complete solutions and assignment files
- **📄 Test Papers**: Previous year internal test papers
- **📚 Syllabus**: Branch-wise syllabus for all departments (CSE, ECE, ME, EE, CE, IoT, IT, BCT, AIADS, AIAML)
- **❓ PYQs**: Previous Year Questions organized by branch

### Features
- **PDF Preview**: View documents directly in browser
- **Download Support**: One-click download functionality
- **Search**: Find specific resources quickly
- **Branch-wise Organization**: Resources categorized by department
- **Mobile Responsive**: Access resources on any device

## Contributing

Built by **Team FluxoNauts** for FluxWave Hackathon Organized by Flux club of [Samrat Ashok Technological Institute Vidisha](https://satiengg.in/).

### Team Members
- **Safal Tiwari** - [SAFAL-TIWARI](https://github.com/SAFAL-TIWARI)
- **Utkarsh Vishwakarma** - [UtkiVish](https://github.com/UtkiVish)
- **Aashutosh Singh Baghel** - [thunder-thigh](https://github.com/thunder-thigh)
- **Hardik Kumar Sinha** - [HKSinha510](https://github.com/HKSinha510)

Contributions and feedback are welcome! Feel free to open issues or submit pull requests.

## License

MIT License