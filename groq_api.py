# groq_api.py
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_groq_response(user_message, model_name="llama3-8b-8192"):
    """
    Function to get response from Groq API with selected model.
    
    Args:
        user_message (str): The user's input message
        model_name (str): The Groq model to use for the response
    
    Returns:
        str: The AI response or error message
    """
    try:
        # Initialize Groq client
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key or groq_api_key == "your_actual_groq_api_key":
            return "❌ Error: GROQ_API_KEY not found or not configured in environment variables"
        
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

def get_available_groq_models():
    """
    Returns list of available Groq models
    """
    return [
        "llama3-8b-8192",
        "llama3-70b-8192", 
        "mixtral-8x7b-32768",
        "gemma-7b-it",
        "gemma2-9b-it"
    ]

def test_groq_connection():
    """
    Test if Groq API is accessible with the current API key
    """
    try:
        groq_api_key = os.getenv("GROQ_API_KEY")
        if not groq_api_key or groq_api_key == "your_actual_groq_api_key":
            return False, "API key not configured"
        
        client = Groq(api_key=groq_api_key)
        
        # Test with a simple message
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Hello",
                }
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=10,
        )
        
        return True, "Connection successful"
        
    except Exception as e:
        return False, f"Connection failed: {str(e)}"

if __name__ == "__main__":
    # Test the Groq API connection
    success, message = test_groq_connection()
    print(f"Groq API Test: {message}")
    
    if success:
        # Test a simple chat
        response = get_groq_response("Hello, how are you?")
        print(f"Test Response: {response}")