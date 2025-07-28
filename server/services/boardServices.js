import axios from "axios";
import { getConfig } from '../config/envConfig.js';

// Get environment-specific configuration
const config = getConfig();

export const dropPills = async (pillIds) => {
  await axios.get(`${config.board.url}/motor?ids=${pillIds.join(',')}`);
  console.log(`Dropping pills with IDs: ${pillIds.join(', ')}`);
};
