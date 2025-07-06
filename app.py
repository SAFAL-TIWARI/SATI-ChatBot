import streamlit as st
from datetime import datetime
import time
import requests
import json
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()
import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

# Set page configuration
st.set_page_config(page_title="SATI Chatbot", page_icon="🤖", layout="centered")

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []
    # Add welcome message
    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": "Hello! I'm SATI AI assistant. How can I help you today?",
            "timestamp": datetime.now().strftime("%H:%M:%S"),
        }
    )

if "is_typing" not in st.session_state:
    st.session_state.is_typing = False

if "selected_model" not in st.session_state:
    st.session_state.selected_model = "phi3"  # Default model

if "available_models" not in st.session_state:
    st.session_state.available_models = []

if "api_provider" not in st.session_state:
    st.session_state.api_provider = "ollama"  # Default to Ollama

if "groq_models" not in st.session_state:
    st.session_state.groq_models = [
        "llama3-8b-8192",
        "llama3-70b-8192", 
        "mixtral-8x7b-32768",
        "gemma-7b-it",
        "gemma2-9b-it"
    ]


# Function to get available Ollama models
def get_available_models():
    """
    Fetch list of available models from Ollama
    """
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
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
        
        # Create chat completion
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": user_message,
                }
            ],
            model=model_name,
            temperature=0.7,
            max_tokens=1024,
        )
        
        return chat_completion.choices[0].message.content.strip()
        
    except Exception as e:
        return f"❌ Groq API Error: {str(e)}"


# OLLAMA INTEGRATION - DYNAMIC MODEL SELECTION
def get_ollama_response(user_message, model_name):
    """
    Function to get response from Ollama running locally with selected model.
    Make sure Ollama is running and the selected model is available.
    """

    try:
        # Ollama API endpoint (default local)
        ollama_url = "http://localhost:11434/api/generate"

        if model_name == "qwen3":
            model_name = "qwen3:0.6b"
        payload = {
            "model": model_name,
            "prompt": user_message,
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
        return "❌ Error: Cannot connect to Ollama. Make sure Ollama is running on localhost:11434"

    except requests.exceptions.Timeout:
        return (
            "⏱️ Error: Request timed out. The model might be taking too long to respond."
        )

    except Exception as e:
        return f"❌ Error: {str(e)}"


def get_bot_response(user_message, model_name, api_provider):
    """
    Unified function to get response from either Ollama or Groq API
    """
    if api_provider == "groq":
        return get_groq_response(user_message, model_name)
    else:
        return get_ollama_response(user_message, model_name)


# App Title
st.title(f"🤖 SATI Chatbot - Hybrid AI")
provider_display = "Groq Cloud" if st.session_state.api_provider == "groq" else "Ollama Local"
st.markdown(f"*Powered by {provider_display} - Multi-Model Support*")

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

    # if st.session_state.available_models:
    #     # Model selector
    #     selected_model = st.selectbox(
    #         "Choose Model:",
    #         options=st.session_state.available_models,
    #         index=(
    #             st.session_state.available_models.index(st.session_state.selected_model)
    #             if st.session_state.selected_model in st.session_state.available_models
    #             else 0
    #         ),
    #         # help="Select which AI model to use for responses",
    #     )

    #     # Update selected model if changed
    #     if selected_model != st.session_state.selected_model:
    #         st.session_state.selected_model = selected_model
    #         st.success(f"✅ Switched to {selected_model}")
    #         st.rerun()

    #     st.info(f"**Current Model:** {st.session_state.selected_model}")

    #     # Show model info if available
    #     try:
    #         model_info_response = requests.post(
    #             "http://localhost:11434/api/show",
    #             json={"name": st.session_state.selected_model},
    #             timeout=5,
    #         )
    #         if model_info_response.status_code == 200:
    #             model_data = model_info_response.json()
    #             model_size = model_data.get("details", {}).get(
    #                 "parameter_size", "Unknown"
    #             )
    #             st.caption(f"Parameters: {model_size}")
    #     except:
    #         pass
    # else:
    #     st.error("❌ No models found")
    #     st.info("Pull a model: `ollama pull <model_name>`")

    # Form submit button
    send_button = st.form_submit_button("📤 Send Message", type="primary")

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
    bot_response = get_bot_response(user_message, st.session_state.selected_model, st.session_state.api_provider)

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
    
    # API Provider selector
    api_provider = st.selectbox(
        "Choose API Provider:",
        options=["ollama", "groq"],
        index=0 if st.session_state.api_provider == "ollama" else 1,
        help="Select between Ollama (local) or Groq (cloud) API",
        format_func=lambda x: "🏠 Ollama (Local)" if x == "ollama" else "☁️ Groq (Cloud)"
    )
    
    # Update API provider if changed
    if api_provider != st.session_state.api_provider:
        st.session_state.api_provider = api_provider
        # Reset model selection when switching providers
        if api_provider == "groq":
            st.session_state.selected_model = st.session_state.groq_models[0]
        else:
            st.session_state.available_models = get_available_models()
            if st.session_state.available_models:
                st.session_state.selected_model = st.session_state.available_models[0]
        st.success(f"✅ Switched to {api_provider.upper()}")
        st.rerun()

    st.markdown("---")
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
                    st.session_state.available_models.index(st.session_state.selected_model)
                    if st.session_state.selected_model in st.session_state.available_models
                    else 0
                ),
                help="Select which Ollama model to use for responses",
            )

            # Update selected model if changed
            if selected_model != st.session_state.selected_model:
                st.session_state.selected_model = selected_model
                st.success(f"✅ Switched to {selected_model}")
                st.rerun()

            st.info(f"**Current Model:** {st.session_state.selected_model}")

            # Show Ollama model info if available
            try:
                model_info_response = requests.post(
                    "http://localhost:11434/api/show",
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
        selected_model = st.selectbox(
            "Choose Groq Model:",
            options=st.session_state.groq_models,
            index=(
                st.session_state.groq_models.index(st.session_state.selected_model)
                if st.session_state.selected_model in st.session_state.groq_models
                else 0
            ),
            help="Select which Groq model to use for responses",
        )

        # Update selected model if changed
        if selected_model != st.session_state.selected_model:
            st.session_state.selected_model = selected_model
            st.success(f"✅ Switched to {selected_model}")
            st.rerun()

        st.info(f"**Current Model:** {st.session_state.selected_model}")
        
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
        try:
            health_check = requests.get("http://localhost:11434/api/tags", timeout=5)
            if health_check.status_code == 200:
                st.success("✅ Ollama is running")
                models_count = len(st.session_state.available_models)
                st.success(f"✅ {models_count} models available")
            else:
                st.error("❌ Ollama not responding")
        except:
            st.error("❌ Ollama not running")
            st.info("Start Ollama: `ollama serve`")
    
    else:  # Groq API
        st.header("☁️ Groq API Status")
        
        groq_api_key = os.getenv("GROQ_API_KEY")
        if groq_api_key and groq_api_key != "your_actual_groq_api_key":
            st.success("✅ Groq API key configured")
            st.success(f"✅ {len(st.session_state.groq_models)} models available")
        else:
            st.error("❌ Groq API key not configured")
            st.info("Set GROQ_API_KEY in .env file")

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
    st.write(f"**Active Model:** {st.session_state.selected_model}")
    if st.session_state.api_provider == "ollama":
        st.write("**Endpoint:** http://localhost:11434")
        st.write("**Timeout:** 60 seconds")
    else:
        st.write("**Endpoint:** Groq Cloud API")
        st.write("**Max Tokens:** 1024")

    st.header("✨ Features")
    st.write("✅ Hybrid API support (Ollama + Groq)")
    st.write("✅ Multi-model support")
    st.write("✅ Dynamic provider switching")
    st.write("✅ Dynamic model switching")
    st.write("✅ Real-time status monitoring")
    st.write("✅ Chat export functionality")

# Footer
st.markdown("---")
st.markdown(
    "**Instructions:** Select your preferred API provider (Ollama or Groq), choose a model, then type a message and click 'Send Message' to start chatting!"
)
if st.session_state.api_provider == "ollama":
    st.markdown("*Note: Make sure Ollama is running locally with your selected model available.*")
else:
    st.markdown("*Note: Make sure your Groq API key is configured in the .env file.*")
