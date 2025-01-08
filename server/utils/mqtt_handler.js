import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

class MqttHandler {
  constructor() {
    this.mqttClient = "mqttx_66130500012";
    this.host = process.env.VITE_MQTT_ENDPOINT;
    this.username = process.env.VITE_MQTT_USERNAME;
    this.password = process.env.VITE_MQTT_PASSWORD;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
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
    this.mqttClient.publish(topic, message);
  }
}

export { MqttHandler };
