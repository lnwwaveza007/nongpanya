import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const BOARD_URL = process.env.BOARD_URL;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const dropPills = async (pillId, amount) => {
  for (let i = 0; i < amount; i++) {
    const res = await axios.get(`${BOARD_URL}/${pillId}`);
    await delay(400);
  }
};
