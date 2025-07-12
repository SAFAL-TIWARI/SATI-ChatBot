# SATI ChatBot - Your Institute Guide

A modern AI chatbot for Samrat Ashok Technological Institute (SATI) with hybrid API support and comprehensive academic resources hub. Features dual AI providers (Google Gemini & Groq), serverless API functions, real-time chat interface, and extensive collection of study materials including notes, assignments, test papers, syllabus, and PYQs for all departments.

## Features

- 🤖 **Dual AI Support**: Google Gemini & Groq cloud APIs with serverless functions
- � **Social Authentication**: Google & GitHub sign-in for personalized experience
- �📖 **Resources Hub**: Access to notes, assignments, test papers, syllabus & PYQs
- ☁️ **Serverless Architecture**: Vercel API functions for secure backend operations
- 💬 **Real-time Chat**: Interactive interface with typing indicators
- 🎨 **Modern UI**: Dark/light themes with responsive design
- 💾 **Chat History**: Persistent conversation storage
- 📚 **SATI Knowledge**: Comprehensive institute information
- 🔧 **Model Switching**: Dynamic AI model selection
- 🔒 **Environment Variables**: Secure API key management via server environment

## Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/SAFAL-TIWARI/SATI-ChatBot/
cd SATI-ChatBot
```

### 2. Configure Environment Variables
Create a `.env.local` file (for Vercel) or set environment variables:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

Get your API keys from:
- **Google Gemini**: [Google AI Studio](https://aistudio.google.com/)
- **Groq**: [Groq Console](https://console.groq.com/)

### 3. Run Locally
```bash
npm start
# Opens at http://localhost:8000
```

### 4. For Vercel Development
```bash
npm install -g vercel
vercel dev
# Opens at http://localhost:3000
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
4. Deploy automatically

### Manual Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### Other Serverless Platforms
- **Netlify Functions**: Requires function adaptation
- **Railway**: Direct deployment with environment variables
- **Render**: Static site with serverless functions

## File Structure

```
SATI-ChatBot/
├── index.html           # Main chatbot application
├── resources.html       # Academic resources page
├── about.html          # About page
├── contact.html        # Contact page
├── script.js           # Core chatbot functionality
├── resources.js        # Resources page functionality
├── api-integration.js  # Frontend API management
├── styles.css          # Main UI styling
├── resources.css       # Resources page styling
├── sati-knowledge.js   # Institute data & knowledge base
├── config.js           # Frontend configuration
├── localhost-config.js # Local development configuration
├── package.json        # Project metadata
├── vercel.json         # Vercel deployment configuration
├── api/                # Serverless API functions
│   ├── gemini.js       # Google Gemini API endpoint
│   ├── groq.js         # Groq API endpoint
│   └── supabase-config.js # Database configuration
└── images/             # Assets and icons
```

## API Configuration

The application uses serverless functions for secure API key management:

### Environment Variables (Production)
Set these in your deployment platform:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `GROQ_API_KEY`: Your Groq API key
- `SUPABASE_URL`: Supabase auth url
- `SUPABASE_KEY`: Supabase anon key

### Local Development
Create a `.env.local` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_auth_url
SUPABASE_KEY=your_supabase_anon_key
```

### API Endpoints
- `/api/gemini` - Google Gemini API proxy
- `/api/groq` - Groq API proxy
- `/api/supabase-config` - Database configuration

## Supported Models

### Google Gemini
- `gemini-1.5-flash` (Default)
- `gemini-1.5-pro`

### Groq
- `llama-3.1-8b-instant`
- `llama-3.3-70b-versatile`
- `gemma2-9b-it`
- `deepseek-r1-distill-llama-70b`
- `llama3-8b-8192`
- `llama3-70b-8192`

## Architecture

### Serverless Design
- **Frontend**: Static HTML/CSS/JavaScript
- **Backend**: Vercel serverless functions
- **APIs**: Proxied through secure serverless endpoints
- **Database**: Supabase integration (optional)

### Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js serverless functions
- **Deployment**: Vercel
- **APIs**: Google Gemini AI, Groq
- **Storage**: LocalStorage for chat history

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

## Development

### Prerequisites
- Node.js 18+ (for Vercel functions)
- Modern web browser
- API keys for Gemini and Groq

### Local Development Setup
1. Clone the repository
2. Set up environment variables
3. Run locally with `npm start` or `vercel dev`
4. Access at `http://localhost:8000` or `http://localhost:3000`

### Testing
- Manual testing through web interface
- API endpoint testing via browser developer tools
- Cross-browser compatibility testing

## Contributing

Built by **Team FluxoNauts** for FluxWave Hackathon Organized by Flux club of [Samrat Ashok Technological Institute Vidisha](https://satiengg.in/).

### Team Members
- **Safal Tiwari** - [SAFAL-TIWARI](https://github.com/SAFAL-TIWARI)
- **Utkarsh Vishwakarma** - [UtkiVish](https://github.com/UtkiVish)
- **Aashutosh Singh Baghel** - [thunder-thigh](https://github.com/thunder-thigh)
- **Hardik Kumar Sinha** - [HKSinha510](https://github.com/HKSinha510)

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Contributions and feedback are welcome! Feel free to open issues or submit pull requests.

## Live Demo

🌐 **Live Application**: [https://sati-chatbot.vercel.app/](https://sati-chatbot.vercel.app/)

## Support

For support, questions, or feedback:
- Open an issue on GitHub
- Contact the development team
- Visit [SATI Official Website](https://satiengg.in/)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div style="text-align:center">
<b>Built with ❤️ by Team FluxoNauts for FluxWave Hackathon</b>
</div>