from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import base64
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    try:
        data = request.json
        img_data = base64.b64decode(data["image"].split(",")[1])
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        analysis = DeepFace.analyze(img, actions=["emotion"], enforce_detection=False)
        emotion = analysis[0]["dominant_emotion"]

        return jsonify({"emotion": emotion})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000)
