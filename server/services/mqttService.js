import { MqttHandler } from "../utils/mqtt_handler.js";

class MqttService {
  constructor() {
    if (MqttService.instance) {
      return MqttService.instance;
    }
    
    this.mqttClient = new MqttHandler();
    this.isInitialized = false;
    MqttService.instance = this;
  }

  initialize() {
    if (!this.isInitialized) {
      console.log('Initializing MQTT connection...');
      this.mqttClient.connect();
      this.isInitialized = true;
    }
    return this.mqttClient;
  }

  getClient() {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.mqttClient;
  }

  disconnect() {
    if (this.isInitialized && this.mqttClient.isClientConnected()) {
      console.log('\nDisconnecting MQTT client...');
      this.mqttClient.disconnect();
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export default new MqttService();
