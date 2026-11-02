
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <h1>Flight Reservation System</h1>
    <p>Welcome to our IMS Project!</p>
    <p>Backend is running successfully.</p>
    """

@app.route("/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Flight Reservation Backend is running"
    })

if __name__ == "__main__":
    app.run(debug=True)