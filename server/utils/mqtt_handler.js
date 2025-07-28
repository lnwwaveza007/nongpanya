import mqtt from "mqtt";
import { getConfig } from "../config/envConfig.js";

class MqttHandler {
  constructor() {
    const config = getConfig();
    this.mqttClient = null;
    this.host = config.mqtt.endpoint;
    this.username = config.mqtt.username;
    this.password = config.mqtt.password;
    this.clientId = config.mqtt.clientId;
    this.messageHandlers = new Map();
  }

  connect() {
    // Check if MQTT configuration is available
    if (!this.host) {
      console.warn("⚠️  MQTT endpoint not configured. Skipping MQTT connection.");
      return;
    }

    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      clientId: this.clientId,
      username: this.username,
      password: this.password,
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });
    
    // When a message arrives, handle it with registered callbacks
    this.mqttClient.on("message", (topic, message) => {
      console.log(`Received MQTT message on topic ${topic}:`, message.toString());
      
      const handler = this.messageHandlers.get(topic);
      if (handler) {
        try {
          handler(topic, message.toString());
        } catch (error) {
          console.error(`Error handling message for topic ${topic}:`, error);
        }
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Subscribe to a topic with a callback handler
  subscribeToTopic(topic, callback) {
    if (!this.mqttClient) {
      console.warn("⚠️  MQTT client not connected. Cannot subscribe to topic.");
      return;
    }

    this.messageHandlers.set(topic, callback);
    this.mqttClient.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err);
      } else {
        console.log(`Successfully subscribed to topic: ${topic}`);
      }
    });
  }

  // Unsubscribe from a topic
  unsubscribeFromTopic(topic) {
    if (!this.mqttClient) {
      console.warn("⚠️  MQTT client not connected. Cannot unsubscribe from topic.");
      return;
    }

    this.messageHandlers.delete(topic);
    this.mqttClient.unsubscribe(topic);
    console.log(`Unsubscribed from topic: ${topic}`);
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    if (!this.mqttClient) {
      console.warn("⚠️  MQTT client not connected. Cannot send message.");
      return;
    }
    this.mqttClient.publish(topic, message);
  }

  // Check if client is connected
  isClientConnected() {
    return this.mqttClient && this.mqttClient.connected;
  }

  // Disconnect MQTT client
  disconnect() {
    if (this.mqttClient) {
      this.mqttClient.end();
      this.mqttClient = null;
    }
    this.messageHandlers.clear();
  }
}

export { MqttHandler };
