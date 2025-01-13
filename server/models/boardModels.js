import dotenv from "dotenv";

dotenv.config();
const BOARD_URL = process.env.BOARD_URL;

export const dropPills = async (pillId, amount) => {
    console.log(pillId);
    for (let i = 0; i < amount; i++) {
        const res = await fetch(`${BOARD_URL}/${pillId}`, {
            method: "GET"
        });
        console.log(res);
    }
};