import prisma from "../config/prismaClient.js";

export const getStock = async (medicalId) => {
  return await prisma.medicine_stocks.findMany({
    where: { medicine_id: medicalId },
    select: {
      medicine_id: true,
      stock_amount: true,
      expire_at: true,
    },
    orderBy: { expire_at: "asc" }, // sort by expiration date
  });
};

export const removeStock = async (medicalId, amount) => {
  const stock = await getStock(medicalId);
  let index = 0;

  while (amount > 0 && index < stock.length) {
    const current = stock[index];

    if (current.stock_amount > amount) {
      await prisma.medicine_stocks.updateMany({
        where: {
          medicine_id: medicalId,
          expire_at: current.expire_at,
        },
        data: {
          stock_amount: {
            decrement: amount,
          },
        },
      });
      amount = 0;
    } else {
      await prisma.medicine_stocks.updateMany({
        where: {
          medicine_id: medicalId,
          expire_at: current.expire_at,
        },
        data: {
          stock_amount: 0,
        },
      });
      amount -= current.stock_amount;
    }

    index++;
  }

  // Check if any stock is low
  const lowStocks = await prisma.medicine_stocks.findMany({
    where: {
      stock_amount: {
        lt: 10,
      },
    },
  });

  for (const s of lowStocks) {
    console.log(`Stock of medicine ${s.medicine_id} is low`);
  }
};
