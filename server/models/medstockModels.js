import connection from "../config/database.js";

export const getStock = async (medicalId) => {
    const [response] = await connection.promise()
    .query(`select medicine_stocks.medicine_id,medicine_stocks.stock_amount,medicine_stocks.expire_at from medicine_stocks
where medicine_id = ?;`,[medicalId]);
    return response;
};

export const removeStock = async (medicalId,amount) => {
    const stock = await getStock(medicalId);
    const n = 0;
    while (amount > 0) {
        if (stock[n].stock_amount > amount) {
            const [response] = await connection.promise()
            .query(`update medicine_stocks set stock_amount = stock_amount - ? where medicine_id = ?;`,[amount,medicalId]);
            amount = 0;
        } else {
            const [response] = await connection.promise()
            .query(`update medicine_stocks set stock_amount = 0 where medicine_id = ?;`,[medicalId]);
            amount -= stock[n].stock_amount;
        }
    }
    //Check if stock is low
    const [response2] = await connection.promise()
    .query(`select * from medicine_stocks where stock_amount < 10;`);
    for (const i in response2) {
        console.log(`Stock of ${response2[i].medicine_id} is low`);
    }
}