import dotenv from "dotenv";

dotenv.config();

export const dropPills = async (pillId, amount) => {
    for (let i = 0; i < amount; i++) {
        const res = await fetch(process.env.BOARD_URL+`/${pillId}`, {
            method: "GET"
        });
    }
};