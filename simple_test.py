#!/usr/bin/env python3
"""
Simple test to verify basic API functionality
"""

import requests
import json

BASE_URL = "https://sqlite-schema-live.preview.emergentagent.com/api"

def test_basic_functionality():
    print("Testing basic API functionality...")
    
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print(f"Root endpoint: {response.status_code} - {response.json()}")
    
    # Test database initialization
    response = requests.post(f"{BASE_URL}/init-database")
    print(f"Database init: {response.status_code} - {response.json()}")
    
    # Test user creation with trailing slash
    user_data = {
        "full_name": "Test Farmer",
        "email": "test@farm.com",
        "phone_number": "+1-555-0123",
        "location": "Test Farm, CA",
        "user_type": "farmer"
    }
    
    response = requests.post(f"{BASE_URL}/users/", json=user_data)
    print(f"Create user: {response.status_code}")
    if response.content:
        try:
            print(f"Response: {response.json()}")
        except:
            print(f"Raw response: {response.text}")
    
    # Test get users
    response = requests.get(f"{BASE_URL}/users/")
    print(f"Get users: {response.status_code}")
    if response.content:
        try:
            users = response.json()
            print(f"Found {len(users)} users")
        except:
            print(f"Raw response: {response.text}")

if __name__ == "__main__":
    test_basic_functionality()