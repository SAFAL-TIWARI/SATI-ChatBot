#!/usr/bin/env python3
"""
Test script to verify production detection logic
"""
import os

def is_production():
    """Check if app is running in production (Streamlit Cloud)"""
    return os.getenv("STREAMLIT_SHARING_MODE") is not None or "streamlit.app" in os.getenv("HOSTNAME", "")

def test_production_detection():
    print("Testing production detection...")
    
    # Test local environment
    print(f"Current environment - is_production(): {is_production()}")
    print(f"STREAMLIT_SHARING_MODE: {os.getenv('STREAMLIT_SHARING_MODE')}")
    print(f"HOSTNAME: {os.getenv('HOSTNAME', 'Not set')}")
    
    # Simulate production environment
    os.environ["STREAMLIT_SHARING_MODE"] = "true"
    print(f"After setting STREAMLIT_SHARING_MODE - is_production(): {is_production()}")
    
    # Clean up
    del os.environ["STREAMLIT_SHARING_MODE"]
    
    # Test hostname detection
    os.environ["HOSTNAME"] = "something.streamlit.app"
    print(f"After setting streamlit.app hostname - is_production(): {is_production()}")
    
    # Clean up
    del os.environ["HOSTNAME"]
    
    print("Production detection test completed!")

if __name__ == "__main__":
    test_production_detection()