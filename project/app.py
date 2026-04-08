import eventlet
eventlet.monkey_patch() # Enable eventlet for asynchronous support

from flask import Flask, render_template
from flask_socketio import SocketIO
import paho.mqtt.client as mqtt


# Initialize Flask app
app = Flask(__name__)

# Enable WebSockets with Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# MQTT Broker Configuration
MQTT_BROKER = "mqtt.cci.arts.ac.uk"
MQTT_PORT = 1883
MQTT_USERNAME = "student"
MQTT_PASSWORD = "austral-clash-sawyer-blaze"
MQTT_TOPIC_PUB = "sandbox/fromMiddleHouse"
MQTT_TOPIC_SUB = "sandbox/toMiddleHouse"

# Callback function when connected to the MQTT broker
def on_connect(client, userdata, flags, reason_code, properties=None):
    if reason_code == 0:
        print("Connected to MQTT broker successfully")
        # Subscribe to the specified topic
        client.subscribe(MQTT_TOPIC_PUB)
    else:
        print(f"Failed to connect, return code {reason_code}")

# Callback function when an MQTT message is received
def on_message(client, userdata, msg):
    with app.app_context():
        message = msg.payload.decode()
        print(f"Received message: {message}")
    
        # Emit the message to the frontend via WebSocket
        socketio.emit("mqtt_message", {"topic": msg.topic, "message": message})

# Listener for MQTT messages from the front end. Sent to MQTT server.
@socketio.on("send_mqtt_message")
def handle_send_mqtt_message(data):
    message = data.get("message", "")
    if message:
        mqtt_client.publish(MQTT_TOPIC_SUB, message)
        print(f"Published message: {message} to topic: {MQTT_TOPIC_SUB}")


# Initialize MQTT Client
mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2) 

# Set MQTT username and password
mqtt_client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)

# Attach the callback functions to the MQTT client
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Connect to the MQTT broker
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)

# Run MQTT loop in a separate thread (non-blocking)
eventlet.spawn(mqtt_client.loop_start)

# Route to serve the HTML page
@app.route("/")
def index():
    return render_template("index.html")

# Run the Flask app with WebSocket support
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
