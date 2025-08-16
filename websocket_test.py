#!/usr/bin/env python3
"""
Simple WebSocket test for the backend
"""

import asyncio
import websockets
import json

async def test_websocket():
    uri = "wss://frontend-test-6.preview.emergentagent.com/ws/test-user-123"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ WebSocket connected successfully")
            
            # Send ping
            ping_message = json.dumps({"type": "ping"})
            await websocket.send(ping_message)
            print("📤 Sent ping message")
            
            # Wait for response
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                print(f"📥 Received response: {response_data}")
                
                if response_data.get("type") == "pong":
                    print("✅ WebSocket ping/pong test passed")
                else:
                    print(f"❌ Unexpected response: {response_data}")
                    
            except asyncio.TimeoutError:
                print("❌ Timeout waiting for pong response")
                
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket())