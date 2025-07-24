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

    // mqtt subscriptions
    this.mqttClient.subscribe("mytopic", { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", function (topic, message) {
      console.log(message.toString());
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    if (!this.mqttClient) {
      console.warn("⚠️  MQTT client not connected. Cannot send message.");
      return;
    }
    this.mqttClient.publish(topic, message);
  }
}

export { MqttHandler };
