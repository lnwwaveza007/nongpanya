import axios from "axios";
import { getConfig } from '../config/envConfig.js';

// Get environment-specific configuration
const config = getConfig();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const dropPills = async (pillId, amount) => {
  for (let i = 0; i < amount; i++) {
    const res = await axios.get(`${config.board.url}/${pillId}`);
    await delay(400);
  }
};
