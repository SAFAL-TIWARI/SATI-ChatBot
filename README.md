# SATI Chatbot - Hybrid AI Assistant

A powerful hybrid chatbot application that supports both **Ollama (local)** and **Groq (cloud)** API providers with dynamic model switching capabilities.

## Features

- 🔄 **Hybrid API Support**: Switch between Ollama (local) and Groq (cloud) APIs
- 🤖 **Multi-Model Support**: Access multiple AI models from both providers
- 🔧 **Dynamic Switching**: Change providers and models on-the-fly
- 💬 **Real-time Chat**: Interactive chat interface with typing indicators
- 📊 **Status Monitoring**: Real-time connection and model status
- 💾 **Export Functionality**: Download chat history as text files
- 🎨 **Modern UI**: Clean, responsive Streamlit interface

## Supported Models

### Ollama Models (Local)
- Any model you have installed locally (phi3, llama3, qwen3, etc.)
- Automatically detects available models

### Groq Models (Cloud)
- llama3-8b-8192
- llama3-70b-8192
- mixtral-8x7b-32768
- gemma-7b-it
- gemma2-9b-it

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd SATI-AI
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

**To get a Groq API key:**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up/Login
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it in your `.env` file

### 4. Setup Ollama (Optional - for local models)
If you want to use Ollama:
1. Install Ollama from [ollama.ai](https://ollama.ai/)
2. Start Ollama service: `ollama serve`
3. Pull desired models: `ollama pull phi3` (or any other model)

### 5. Run the Application
```bash
streamlit run app.py
```

## Usage

1. **Select API Provider**: Choose between Ollama (local) or Groq (cloud) in the sidebar
2. **Choose Model**: Select from available models for your chosen provider
3. **Start Chatting**: Type your message and click "Send Message"
4. **Switch Anytime**: Change providers or models during your conversation
5. **Export Chat**: Download your conversation history when needed

## File Structure

```
SATI-AI/
├── app.py      # Main hybrid application
├── requirements.txt   # Python dependencies
├── .env              # Environment variables (create this)
├── README.md         # This file
└── ...
```

## Deployment Options

### For Groq-only Deployment (Recommended for cloud deployment):

**Files needed:**
- `app.py`
- `requirements.txt`
- `.env` (with your Groq API key)

**Deployment Platforms:**
1. **Streamlit Cloud** (Recommended)
   - Connect your GitHub repository
   - Add `GROQ_API_KEY` in secrets
   - Deploy automatically

2. **Heroku**
   - Add `GROQ_API_KEY` as config var
   - Deploy via Git

3. **Railway**
   - Add environment variables
   - Deploy from GitHub

4. **Render**
   - Add environment variables
   - Deploy from GitHub

### For Local Development:
- Use both Ollama and Groq for maximum flexibility
- Ollama for privacy-focused local inference
- Groq for fast cloud-based responses

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes (for Groq functionality) |

## Troubleshooting

### Ollama Issues:
- Ensure Ollama is running: `ollama serve`
- Check if models are installed: `ollama list`
- Pull models if needed: `ollama pull <model-name>`

### Groq Issues:
- Verify API key is correct in `.env` file
- Check internet connection
- Ensure API key has sufficient credits

### General Issues:
- Restart the Streamlit app
- Check console for error messages
- Verify all dependencies are installed

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## License

This project is open source and available under the MIT License.