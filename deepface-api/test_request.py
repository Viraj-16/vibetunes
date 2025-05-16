import requests
import base64

# Load image and convert to base64
with open("test.jpg", "rb") as image_file:
    base64_image = base64.b64encode(image_file.read()).decode("utf-8")
    payload = {"image": f"data:image/jpeg;base64,{base64_image}"}

# Send POST request to Flask API
response = requests.post("http://localhost:8000/detect-emotion", json=payload)
print(response.json())
