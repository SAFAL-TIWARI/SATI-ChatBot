import streamlit as st
from datetime import datetime
import time
import requests
import json
import os
from dotenv import load_dotenv
from groq import Groq
import google.generativeai as genai
from prompt import get_contextual_prompt, get_default_prompt
from urllib.parse import urlparse, parse_qs

# Load environment variables
load_dotenv()

# Custom CSS for profile menu and settings popup
def load_custom_css():
    st.markdown("""
    <style>
    /* Profile Menu Styles */
    .profile-menu {
        position: fixed;
        top: 10px;
        right: 20px;
        z-index: 1000;
    }
    
    .profile-button {
        background: #ff4b4b;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .profile-dropdown {
        position: absolute;
        top: 50px;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 200px;
        z-index: 1001;
    }
    
    .profile-dropdown-item {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .profile-dropdown-item:hover {
        background: #f8f9fa;
    }
    
    .profile-dropdown-item:last-child {
        border-bottom: none;
    }
    
    /* Settings Modal Styles */
    .settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .settings-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 800px;
        height: 80%;
        max-height: 600px;
        display: flex;
        overflow: hidden;
    }
    
    .settings-sidebar {
        width: 250px;
        background: #f8f9fa;
        border-right: 1px solid #e9ecef;
        padding: 20px 0;
    }
    
    .settings-main {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    
    .settings-tab {
        padding: 12px 20px;
        cursor: pointer;
        border-left: 3px solid transparent;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .settings-tab:hover {
        background: #e9ecef;
    }
    
    .settings-tab.active {
        background: #e3f2fd;
        border-left-color: #2196f3;
        color: #1976d2;
    }
    
    .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    .close-button:hover {
        color: #000;
    }
    
    /* Hide Streamlit default elements when settings is open */
    .settings-open .main .block-container {
        filter: blur(2px);
        pointer-events: none;
    }
    </style>
    """, unsafe_allow_html=True)


# Check if running in production (Streamlit Cloud)
def is_production():
    """Check if app is running in production (Streamlit Cloud)"""
    return os.getenv(
        "STREAMLIT_SHARING_MODE"
    ) is not None or "streamlit.app" in os.getenv("HOSTNAME", "")


# Set page configuration
st.set_page_config(
    page_title="SATI Chatbot",
    page_icon="🤖",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# Load custom CSS
load_custom_css()

# Handle URL parameters for settings
query_params = st.query_params
if "settings" in query_params or st.session_state.get("show_settings", False):
    st.session_state.show_settings = True

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []
    # Add welcome message
    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": "🎓 Hello! I'm your SATI AI Assistant, specialized in providing information about Samrat Ashok Technological Institute (SATI), Vidisha. I can help you with:\n\n• 📚 Academic programs and courses\n• 🏠 Hostel and campus facilities\n• 💼 Placement statistics and career opportunities\n• 🎯 Admission procedures and requirements\n• 🏆 Student activities and clubs\n• 📖 Institute history and achievements\n\nWhat would you like to know about SATI?",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }
    )

if "is_typing" not in st.session_state:
    st.session_state.is_typing = False

if "selected_model" not in st.session_state:
    # Default to Groq model both in production and locally
    st.session_state.selected_model = (
        "llama-3.1-8b-instant"  # Default Groq model (updated)
    )

if "available_models" not in st.session_state:
    st.session_state.available_models = []

if "api_provider" not in st.session_state:
    # Default to Groq both in production and locally
    st.session_state.api_provider = "groq"

if "groq_models" not in st.session_state:
    st.session_state.groq_models = [
        # Production Models (Stable & Recommended)
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "gemma2-9b-it",
        # Working Models
        "deepseek-r1-distill-llama-70b",
        "llama3-8b-8192",
        "llama3-70b-8192",
    ]

# Initialize user authentication state
if "is_logged_in" not in st.session_state:
    st.session_state.is_logged_in = False

if "username" not in st.session_state:
    st.session_state.username = ""

if "show_settings" not in st.session_state:
    st.session_state.show_settings = False

if "settings_tab" not in st.session_state:
    st.session_state.settings_tab = "customization"

# Authentication functions
def handle_login():
    """Handle user login"""
    st.session_state.is_logged_in = True
    st.session_state.username = "User"  # In a real app, this would come from a form
    st.rerun()

def handle_logout():
    """Handle user logout"""
    st.session_state.is_logged_in = False
    st.session_state.username = ""
    st.rerun()

def toggle_settings():
    """Toggle settings modal"""
    st.session_state.show_settings = not st.session_state.show_settings
    if st.session_state.show_settings:
        st.query_params["settings"] = "true"
    else:
        if "settings" in st.query_params:
            del st.query_params["settings"]
    st.rerun()

def close_settings():
    """Close settings modal"""
    st.session_state.show_settings = False
    if "settings" in st.query_params:
        del st.query_params["settings"]
    st.rerun()

def render_profile_menu():
    """Render the profile menu at top right"""
    if st.session_state.is_logged_in:
        profile_icon = "👤"
        profile_text = st.session_state.username
    else:
        profile_icon = "🔐"
        profile_text = "Guest"
    
    # Create columns for profile menu positioning
    col1, col2, col3, col4 = st.columns([6, 1, 1, 1])
    
    with col2:
        # Login/Logout button
        if not st.session_state.is_logged_in:
            if st.button("🔑 Login", key="login_btn", help="Login to access personalized features"):
                handle_login()
        else:
            if st.button("🔓 Logout", key="logout_btn", help="Logout from your account"):
                handle_logout()
    
    with col3:
        # Settings button
        if st.button("⚙️ Settings", key="settings_btn", help="Open settings panel"):
            toggle_settings()
    
    with col4:
        # Profile indicator
        st.markdown(f"**{profile_icon} {profile_text}**")

def render_settings_modal():
    """Render the settings modal popup"""
    if not st.session_state.show_settings:
        return
    
    # Update URL to include settings parameter
    st.query_params["settings"] = "true"
    
    # Settings modal using container
    st.markdown("---")
    st.markdown("## ⚙️ Settings Panel")
    
    # Close button
    col1, col2 = st.columns([6, 1])
    with col2:
        if st.button("✕ Close Settings", key="close_settings_btn"):
            close_settings()
    
    # Settings tabs
    tab1, tab2 = st.tabs(["🎨 Customization", "🔧 Advanced"])
    
    with tab1:
        render_customization_settings()
    
    with tab2:
        st.write("🚧 Advanced settings coming soon...")
        st.info("Future features: Theme customization, export settings, API rate limits, etc.")
    
    st.markdown("---")

def render_customization_settings():
    """Render customization settings tab"""
    st.subheader("🎨 Customization")
    
    # API Provider Selection
    st.markdown("#### Choose API Provider")
    
    # Determine available providers based on environment
    if is_production():
        available_providers = ["groq", "gemini"]
        st.info("🌐 Running in production - Only cloud APIs available")
    else:
        available_providers = ["groq", "gemini", "ollama"]
    
    # API Provider selector
    api_provider = st.selectbox(
        "API Provider:",
        options=available_providers,
        index=(
            available_providers.index(st.session_state.api_provider)
            if st.session_state.api_provider in available_providers
            else 0
        ),
        help="Select between Ollama (local), Groq (cloud), or Gemini (cloud) API",
        format_func=lambda x: (
            "🏠 Ollama (Local)"
            if x == "ollama"
            else "☁️ Groq (Cloud)" if x == "groq" else "🧠 Google Gemini (Cloud)"
        ),
        key="settings_api_provider_selector",
    )
    
    # Update API provider if changed
    if api_provider != st.session_state.api_provider:
        st.session_state.api_provider = api_provider
        # Reset model selection when switching providers
        if api_provider == "groq":
            st.session_state.selected_model = st.session_state.groq_models[0]
        elif api_provider == "gemini":
            st.session_state.selected_model = "gemini-1.5-flash"
        else:  # ollama
            st.session_state.available_models = get_available_models()
            if st.session_state.available_models:
                st.session_state.selected_model = st.session_state.available_models[0]
        st.success(f"✅ Switched to {api_provider.upper()}")
        st.rerun()
    
    st.markdown("---")
    
    # AI Model Selection
    if st.session_state.api_provider != "gemini":
        st.markdown("#### Choose AI Model")
        
        if st.session_state.api_provider == "groq":
            # Format function for Groq models
            def format_groq_model_name(model_name):
                if model_name in [
                    "llama-3.1-8b-instant",
                    "llama-3.3-70b-versatile",
                    "gemma2-9b-it",
                ]:
                    return f"🟢 {model_name} (Latest)"
                elif model_name == "deepseek-r1-distill-llama-70b":
                    return f"🧠 {model_name} (Reasoning)"
                else:
                    return f"🔵 {model_name} (Legacy)"
            
            selected_model = st.selectbox(
                "Groq AI Model:",
                options=st.session_state.groq_models,
                index=(
                    st.session_state.groq_models.index(st.session_state.selected_model)
                    if st.session_state.selected_model in st.session_state.groq_models
                    else 0
                ),
                format_func=format_groq_model_name,
                key="settings_groq_model_selector",
            )
            
            # Update selected model if changed
            if selected_model != st.session_state.selected_model:
                st.session_state.selected_model = selected_model
                st.success(f"✅ Switched to {st.session_state.selected_model}")
                st.rerun()
        
        elif st.session_state.api_provider == "ollama":
            # Get available Ollama models
            if not st.session_state.available_models:
                st.session_state.available_models = get_available_models()
            
            if st.session_state.available_models:
                selected_model = st.selectbox(
                    "Ollama AI Model:",
                    options=st.session_state.available_models,
                    index=(
                        st.session_state.available_models.index(st.session_state.selected_model)
                        if st.session_state.selected_model in st.session_state.available_models
                        else 0
                    ),
                    key="settings_ollama_model_selector",
                )
                
                # Update selected model if changed
                if selected_model != st.session_state.selected_model:
                    st.session_state.selected_model = selected_model
                    st.success(f"✅ Switched to {st.session_state.selected_model}")
                    st.rerun()
            else:
                st.error("No Ollama models available")
                st.info("Pull a model: `ollama pull <model_name>`")


# Function to get available Ollama models
def get_available_models():
    """
    Fetch list of available models from Ollama
    """
    # Don't try to fetch Ollama models in production
    if is_production():
        return []

    try:
        ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        response = requests.get(f"{ollama_base_url}/api/tags", timeout=5)
        if response.status_code == 200:
            data = response.json()
            models = []
            for model in data.get("models", []):
                model_name = model.get("name", "").split(":")[
                    0
                ]  # Remove tag if present
                if model_name and model_name not in models:
                    models.append(model_name)
            return sorted(models)
        else:
            return []
    except:
        return []


# Helper function to clean DeepSeek response
def clean_deepseek_response(response_text):
    """
    Remove <think></think> tags from DeepSeek model responses
    to show only the final answer, not the thinking process.
    """
    import re

    # Remove everything between <think> and </think> tags (including the tags)
    # Using re.DOTALL flag to match newlines as well
    cleaned_response = re.sub(
        r"<think>.*?</think>", "", response_text, flags=re.DOTALL | re.IGNORECASE
    )

    # Also handle cases where tags might be malformed or incomplete
    cleaned_response = re.sub(
        r"<think>.*", "", cleaned_response, flags=re.DOTALL | re.IGNORECASE
    )
    cleaned_response = re.sub(
        r".*</think>", "", cleaned_response, flags=re.DOTALL | re.IGNORECASE
    )

    # Clean up any extra whitespace and newlines
    cleaned_response = re.sub(
        r"\n\s*\n", "\n", cleaned_response
    )  # Remove multiple empty lines
    cleaned_response = cleaned_response.strip()

    # If the response is empty after cleaning, return a fallback message
    if not cleaned_response:
        return "I've processed your request. Please let me know if you need any clarification or have additional questions."

    return cleaned_response


# GROQ API INTEGRATION
def get_groq_response(user_message, model_name):
    """
    Function to get response from Groq API with selected model.
    """
    try:
        # Initialize Groq client
        try:
            groq_api_key = st.secrets["GROQ_API_KEY"]
        except KeyError:
            # Fallback to environment variable for local development
            groq_api_key = os.getenv("GROQ_API_KEY")
            if not groq_api_key:
                return "❌ Error: GROQ_API_KEY not found in secrets or environment variables"

        client = Groq(api_key=groq_api_key)

        # Get contextual prompt with SATI knowledge
        contextual_prompt = get_contextual_prompt(user_message)

        # Create chat completion with system prompt and user message
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": contextual_prompt,
                },
                {
                    "role": "user",
                    "content": user_message,
                },
            ],
            model=model_name,
            temperature=0.7,
            max_tokens=1024,
        )

        response_content = chat_completion.choices[0].message.content.strip()

        # Clean DeepSeek response if using DeepSeek model
        if model_name == "deepseek-r1-distill-llama-70b":
            response_content = clean_deepseek_response(response_content)

        return response_content

    except Exception as e:
        return f"❌ Groq API Error: {str(e)}"


# GOOGLE GEMINI API INTEGRATION
def get_gemini_response(user_message):
    """
    Function to get response from Google Gemini API.
    Uses the free Gemini model (gemini-1.5-flash).
    """
    try:
        # Get Gemini API key
        try:
            gemini_api_key = st.secrets["GEMINI_API_KEY"]
        except KeyError:
            # Fallback to environment variable for local development
            gemini_api_key = os.getenv("GEMINI_API_KEY")
            if not gemini_api_key:
                return "❌ Error: GEMINI_API_KEY not found in secrets or environment variables"

        # Configure Gemini API
        genai.configure(api_key=gemini_api_key)

        # Get contextual prompt with SATI knowledge
        contextual_prompt = get_contextual_prompt(user_message)

        # Use the free Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate response with contextual prompt
        full_prompt = f"{contextual_prompt}\n\nUser Query: {user_message}"
        response = model.generate_content(full_prompt)

        return response.text.strip()

    except Exception as e:
        return f"❌ Gemini API Error: {str(e)}"


# OLLAMA INTEGRATION - DYNAMIC MODEL SELECTION
def get_ollama_response(user_message, model_name):
    """
    Function to get response from Ollama running locally with selected model.
    Make sure Ollama is running and the selected model is available.
    """

    try:
        # Ollama API endpoint (configurable via environment variable)
        ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        ollama_url = f"{ollama_base_url}/api/generate"

        if model_name == "qwen3":
            model_name = "qwen3:0.6b"

        # Get contextual prompt with SATI knowledge
        contextual_prompt = get_contextual_prompt(user_message)
        full_prompt = f"{contextual_prompt}\n\nUser Query: {user_message}"

        payload = {
            "model": model_name,
            "prompt": full_prompt,
            "stream": False,  # Set to False to get complete response at once
        }
        print(payload)
        # Make request to Ollama
        response = requests.post(
            ollama_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=60,  # 60 second timeout for larger models
        )

        if response.status_code == 200:
            result = response.json()
            bot_response = result.get(
                "response", "Sorry, I couldn't generate a response."
            )
            return bot_response.strip()
        else:
            return f"Error: Ollama API returned status code {response.status_code}"

    except requests.exceptions.ConnectionError:
        if is_production():
            return "❌ Error: Ollama is not available in production. Please use Groq API instead."
        else:
            return "❌ Error: Cannot connect to Ollama. Make sure Ollama is running on localhost:11434"

    except requests.exceptions.Timeout:
        return (
            "⏱️ Error: Request timed out. The model might be taking too long to respond."
        )

    except Exception as e:
        return f"❌ Error: {str(e)}"


def get_bot_response(user_message, model_name, api_provider):
    """
    Unified function to get response from Ollama, Groq, or Gemini API
    """
    if api_provider == "groq":
        return get_groq_response(user_message, model_name)
    elif api_provider == "gemini":
        return get_gemini_response(user_message)
    else:
        return get_ollama_response(user_message, model_name)


# Profile Menu (Top Right)
render_profile_menu()

# Settings Modal
if st.session_state.show_settings:
    render_settings_modal()

# App Title
st.title(f"🎓 SATI AI Assistant - Your Institute Guide")
if st.session_state.api_provider == "groq":
    provider_display = "Groq Cloud"
elif st.session_state.api_provider == "gemini":
    provider_display = "Google Gemini"
else:
    provider_display = "Ollama Local"
st.markdown(
    f"*Powered by {provider_display} - Specialized for Samrat Ashok Technological Institute*"
)
st.info(
    "💡 Ask me anything about SATI - courses, admissions, facilities, placements, hostels, and more!"
)

# Main chat area
st.subheader("💬 Chat")

# Display chat messages
for message in st.session_state.messages:
    if message["role"] == "user":
        st.markdown(f"**You** ({message['timestamp']})")
        st.info(message["content"])
    else:
        st.markdown(f"**Bot** ({message['timestamp']})")
        st.success(message["content"])

# Show typing indicator
if st.session_state.is_typing:
    st.markdown("**Bot** is typing...")
    st.warning("🤖 Thinking...")

# Input section
st.markdown("---")
st.subheader("📝 Your Message")

# Create a form for input to handle submission properly
with st.form(key="chat_form", clear_on_submit=True):
    user_input = st.text_input("Type your message:", placeholder="Ask me anything...")

    # Form submit button and model selector in the same row
    col1, col2 = st.columns([2, 1])

    with col1:
        send_button = st.form_submit_button("📤 Send Message", type="primary")

    with col2:
        # Display current model info (read-only)
        if st.session_state.api_provider == "groq":
            if st.session_state.selected_model in [
                "llama-3.1-8b-instant",
                "llama-3.3-70b-versatile",
                "gemma2-9b-it",
            ]:
                model_display = (
                    f"🟢 {st.session_state.selected_model.split('-')[0].upper()}"
                )
            elif st.session_state.selected_model == "deepseek-r1-distill-llama-70b":
                model_display = f"🧠 DeepSeek"
            else:
                model_display = (
                    f"🔵 {st.session_state.selected_model.split('-')[0].upper()}"
                )
        else:
            model_display = f"🤖 {st.session_state.selected_model}"

        # st.info(f"**Current:** {model_display}")

# Model selector outside the form for immediate response (positioned below the form)
# Only show model selector for Groq and Ollama, not for Gemini
if st.session_state.api_provider == "groq":
    # Format function for Groq models (same as sidebar)
    def format_groq_model_name(model_name):
        """Format model names for better display"""
        if model_name in [
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
            "gemma2-9b-it",
        ]:
            return f"🟢 {model_name} (Latest)"
        elif model_name == "deepseek-r1-distill-llama-70b":
            return f"🧠 {model_name} (Reasoning)"
        else:
            return f"🔵 {model_name} (Legacy)"

    selected_model_main = st.selectbox(
        "Choose Groq AI Model:",
        options=st.session_state.groq_models,
        index=(
            st.session_state.groq_models.index(st.session_state.selected_model)
            if st.session_state.selected_model in st.session_state.groq_models
            else 0
        ),
        format_func=format_groq_model_name,
        key="main_groq_model_selector",
    )

    # Update selected model if changed
    if selected_model_main != st.session_state.selected_model:
        st.session_state.selected_model = selected_model_main
        st.success(f"✅ Switched to {st.session_state.selected_model}")
        st.rerun()

elif st.session_state.api_provider == "ollama":
    # Ollama model selector
    if not st.session_state.available_models:
        st.session_state.available_models = get_available_models()

    if st.session_state.available_models:
        selected_model_main = st.selectbox(
            "Choose Ollama AI Model:",
            options=st.session_state.available_models,
            index=(
                st.session_state.available_models.index(st.session_state.selected_model)
                if st.session_state.selected_model in st.session_state.available_models
                else 0
            ),
            key="main_ollama_model_selector",
        )

        # Update selected model if changed
        if selected_model_main != st.session_state.selected_model:
            st.session_state.selected_model = selected_model_main
            st.success(f"✅ Switched to {st.session_state.selected_model}")
            st.rerun()
    else:
        st.error("No Ollama models available")

# For Gemini, no model selector is shown (it uses gemini-1.5-flash by default)

# Other buttons outside the form
col1, col2 = st.columns([1, 1])

with col1:
    clear_button = st.button("🗑️ Clear Chat")

with col2:
    export_button = st.button("💾 Export Chat")

# Handle send message
if send_button and user_input.strip():
    # Add user message to chat
    current_time = datetime.now().strftime("%H:%M:%S")
    st.session_state.messages.append(
        {"role": "user", "content": user_input.strip(), "timestamp": current_time}
    )

    # Set typing indicator
    st.session_state.is_typing = True
    st.rerun()

# Handle bot response
if st.session_state.is_typing:
    # Get bot response using selected model and API provider
    user_message = st.session_state.messages[-1]["content"]
    bot_response = get_bot_response(
        user_message, st.session_state.selected_model, st.session_state.api_provider
    )

    # Add bot response to chat
    current_time = datetime.now().strftime("%H:%M:%S")
    st.session_state.messages.append(
        {"role": "assistant", "content": bot_response, "timestamp": current_time}
    )

    # Remove typing indicator
    st.session_state.is_typing = False
    st.rerun()

# Handle clear chat
if clear_button:
    st.session_state.messages = []
    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": "Hello! I'm your AI assistant. How can I help you today?",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }
    )
    st.session_state.is_typing = False
    st.success("Chat cleared!")
    st.rerun()

# Handle export chat
if export_button:
    if len(st.session_state.messages) > 1:  # More than just welcome message
        chat_content = "CHATBOT CONVERSATION\n" + "=" * 50 + "\n\n"
        for msg in st.session_state.messages:
            role = "You" if msg["role"] == "user" else "Bot"
            chat_content += f"[{msg['timestamp']}] {role}: {msg['content']}\n\n"

        st.download_button(
            label="📄 Download Chat History",
            data=chat_content,
            file_name=f"chat_history_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt",
            mime="text/plain",
        )
    else:
        st.warning("No messages to export yet!")

# Sidebar with info
with st.sidebar:
    st.header("🔧 API Provider Selection")

    # Determine available providers based on environment
    if is_production():
        # In production, show cloud APIs (Groq and Gemini)
        available_providers = ["groq", "gemini"]
        st.info("🌐 Running in production - Only cloud APIs available")
    else:
        # Locally, show all options (Groq first as default)
        available_providers = ["groq", "gemini", "ollama"]

    # API Provider selector
    api_provider = st.selectbox(
        "Choose API Provider:",
        options=available_providers,
        index=(
            available_providers.index(st.session_state.api_provider)
            if st.session_state.api_provider in available_providers
            else 0
        ),
        help="Select between Ollama (local), Groq (cloud), or Gemini (cloud) API",
        format_func=lambda x: (
            "🏠 Ollama (Local)"
            if x == "ollama"
            else "☁️ Groq (Cloud)" if x == "groq" else "🧠 Google Gemini (Cloud)"
        ),
        key="api_provider_selector",
    )

    # Update API provider if changed
    if api_provider != st.session_state.api_provider:
        st.session_state.api_provider = api_provider
        # Reset model selection when switching providers
        if api_provider == "groq":
            st.session_state.selected_model = st.session_state.groq_models[0]
        elif api_provider == "gemini":
            st.session_state.selected_model = "gemini-1.5-flash"  # Default Gemini model
        else:  # ollama
            st.session_state.available_models = get_available_models()
            if st.session_state.available_models:
                st.session_state.selected_model = st.session_state.available_models[0]
        st.success(f"✅ Switched to {api_provider.upper()}")
        st.rerun()

    st.markdown("---")

    # Only show model selection for Groq and Ollama, not for Gemini
    if st.session_state.api_provider != "gemini":
        st.header("🤖 Model Selection")

    if st.session_state.api_provider == "ollama":
        # Refresh models button for Ollama
        if st.button("🔄 Refresh Models", help="Fetch latest available Ollama models"):
            st.session_state.available_models = get_available_models()
            st.rerun()

        # Get available Ollama models
        if not st.session_state.available_models:
            st.session_state.available_models = get_available_models()

        if st.session_state.available_models:
            # Ollama Model selector
            selected_model = st.selectbox(
                "Choose Ollama Model:",
                options=st.session_state.available_models,
                index=(
                    st.session_state.available_models.index(
                        st.session_state.selected_model
                    )
                    if st.session_state.selected_model
                    in st.session_state.available_models
                    else 0
                ),
                help="Select which Ollama model to use for responses",
                key="sidebar_ollama_model_selector",
            )

            # Update selected model if changed
            if selected_model != st.session_state.selected_model:
                st.session_state.selected_model = selected_model
                st.success(f"✅ Switched to {selected_model}")
                st.rerun()

            st.info(f"**Current Model:** {st.session_state.selected_model}")

            # Show Ollama model info if available
            try:
                ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
                model_info_response = requests.post(
                    f"{ollama_base_url}/api/show",
                    json={"name": st.session_state.selected_model},
                    timeout=5,
                )
                if model_info_response.status_code == 200:
                    model_data = model_info_response.json()
                    model_size = model_data.get("details", {}).get(
                        "parameter_size", "Unknown"
                    )
                    st.caption(f"Parameters: {model_size}")
            except:
                pass
        else:
            st.error("❌ No Ollama models found")
            st.info("Pull a model: `ollama pull <model_name>`")

    else:  # Groq API
        # Groq Model selector
        def format_model_name(model_name):
            """Format model names for better display"""
            if model_name in [
                "llama-3.1-8b-instant",
                "llama-3.3-70b-versatile",
                "gemma2-9b-it",
            ]:
                return f"🟢 {model_name} (Latest)"
            elif model_name == "deepseek-r1-distill-llama-70b":
                return f"🧠 {model_name} (Reasoning)"
            else:
                return f"🔵 {model_name} (Legacy)"

        selected_model = st.selectbox(
            "Choose Groq Model:",
            options=st.session_state.groq_models,
            index=(
                st.session_state.groq_models.index(st.session_state.selected_model)
                if st.session_state.selected_model in st.session_state.groq_models
                else 0
            ),
            help="Select which Groq model to use for responses. Latest models are recommended for better performance.",
            format_func=format_model_name,
            key="sidebar_groq_model_selector",
        )

        # Update selected model if changed
        if selected_model != st.session_state.selected_model:
            st.session_state.selected_model = selected_model
            st.success(f"✅ Switched to {selected_model}")
            st.rerun()

        st.info(f"**Current Model:** {st.session_state.selected_model}")

        # Show model type information
        if st.session_state.selected_model in [
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
            "gemma2-9b-it",
        ]:
            st.success("🟢 **Production Model** - Latest & Recommended")
        elif st.session_state.selected_model == "deepseek-r1-distill-llama-70b":
            st.success("🧠 **Reasoning Model** - Advanced Math & Logic")
        else:
            st.info("🔵 **Legacy Model** - Stable & Working")

        # Check Groq API key
        groq_api_key = os.getenv("GROQ_API_KEY")
        if groq_api_key and groq_api_key != "your_actual_groq_api_key":
            st.success("✅ Groq API key configured")
        else:
            st.error("❌ Groq API key not configured")
            st.info("Set GROQ_API_KEY in .env file")

    st.markdown("---")

    if st.session_state.api_provider == "ollama":
        st.header("🔗 Ollama Status")

        # Check Ollama connection
        if is_production():
            st.error("❌ Ollama not available in production")
            st.info(
                "Ollama requires local installation and cannot run on cloud servers"
            )
        else:
            try:
                ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
                health_check = requests.get(f"{ollama_base_url}/api/tags", timeout=5)
                if health_check.status_code == 200:
                    st.success("✅ Ollama is running")
                    models_count = len(st.session_state.available_models)
                    st.success(f"✅ {models_count} models available")
                else:
                    st.error("❌ Ollama not responding")
            except:
                st.error("❌ Ollama not running")
                st.info("Start Ollama: `ollama serve`")

    elif st.session_state.api_provider == "groq":
        st.header("☁️ Groq API Status")

        groq_api_key = os.getenv("GROQ_API_KEY")
        if groq_api_key and groq_api_key != "your_actual_groq_api_key":
            st.success("✅ Groq API key configured")
            st.success(f"✅ {len(st.session_state.groq_models)} models available")
        else:
            st.error("❌ Groq API key not configured")
            st.info("Set GROQ_API_KEY in .env file")

    else:  # Gemini API
        st.header("🧠 Google Gemini API Status")

        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if gemini_api_key:
            st.success("✅ Gemini API key configured")
            st.success("✅ Using gemini-1.5-flash (Free Model)")
        else:
            st.error("❌ Gemini API key not configured")
            st.info("Set GEMINI_API_KEY in .env file")

    st.markdown("---")

    st.header("📊 Chat Stats")
    total_messages = len(st.session_state.messages)
    user_messages = len([m for m in st.session_state.messages if m["role"] == "user"])
    bot_messages = len(
        [m for m in st.session_state.messages if m["role"] == "assistant"]
    )

    st.metric("Total Messages", total_messages)
    st.metric("Your Messages", user_messages)
    st.metric("Bot Messages", bot_messages)

    st.markdown("---")

    # Only show Available Models section for providers that have multiple models
    if st.session_state.api_provider != "gemini":
        st.header("📋 Available Models")
        if st.session_state.api_provider == "ollama":
            if st.session_state.available_models:
                for i, model in enumerate(st.session_state.available_models, 1):
                    if model == st.session_state.selected_model:
                        st.write(f"{i}. **{model}** ← *Current*")
                    else:
                        st.write(f"{i}. {model}")
            else:
                st.write("No Ollama models found")
        else:  # Groq API
            for i, model in enumerate(st.session_state.groq_models, 1):
                if model == st.session_state.selected_model:
                    st.write(f"{i}. **{model}** ← *Current*")
                else:
                    st.write(f"{i}. {model}")

    st.markdown("---")

    st.header("⚙️ Configuration")
    st.write(f"**API Provider:** {st.session_state.api_provider.upper()}")
    if st.session_state.api_provider != "gemini":
        st.write(f"**Active Model:** {st.session_state.selected_model}")
    if st.session_state.api_provider == "ollama":
        st.write("**Endpoint:** http://localhost:11434")
        st.write("**Timeout:** 60 seconds")
    elif st.session_state.api_provider == "groq":
        st.write("**Endpoint:** Groq Cloud API")
        st.write("**Max Tokens:** 1024")
    else:  # gemini
        st.write("**Model:** gemini-1.5-flash (Free)")
        st.write("**Endpoint:** Google Gemini API")

    st.header("✨ Features")
    st.write("✅ SATI-specialized knowledge base")
    st.write("✅ Hybrid API support (Ollama + Groq + Gemini)")
    st.write("✅ Multi-model support")
    st.write("✅ Dynamic provider switching")
    st.write("✅ Dynamic model switching")
    st.write("✅ Real-time status monitoring")
    st.write("✅ Chat export functionality")

    st.markdown("---")

    st.header("🎓 About SATI")
    st.write("**Samrat Ashok Technological Institute**")
    st.write("📍 Vidisha, Madhya Pradesh")
    st.write("📅 Established: 1960")
    st.write("🏛️ Autonomous Engineering College")
    st.write("🎯 85-acre campus")
    st.write("👥 9 UG + 16 PG programs")
    st.write("🏆 NAAC & NBA accredited")

    with st.expander("🔍 Quick SATI Facts"):
        st.write("• Founded by Maharaja Jiwajirao Scindia")
        st.write("• Foundation stone by PM Nehru (1962)")
        st.write("• Named after Emperor Ashoka")
        st.write("• Alumni: Nobel laureate Kailash Satyarthi")
        st.write("• Highest placement: ₹21 LPA")
        st.write("• 6 hostels (325+200 capacity)")
        st.write("• 70,000+ library volumes")

# Footer
st.markdown("---")
st.markdown(
    "**Instructions:** Select your preferred AI provider, choose a model, then ask me anything about SATI - courses, admissions, facilities, placements, hostels, history, and more!"
)
if st.session_state.api_provider == "ollama":
    st.markdown(
        "*Note: Make sure Ollama is running locally with your selected model available.*"
    )
elif st.session_state.api_provider == "groq":
    st.markdown("*Note: Make sure your Groq API key is configured in the .env file.*")
else:  # gemini
    st.markdown("*Note: Make sure your Gemini API key is configured in the .env file.*")
