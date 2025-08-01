import prisma from "../config/prismaClient.js";
import logger from "../utils/logger.js";

export const getAllMedicineStock = async (withExpired = false) => {
  const now = new Date();

  const medicines = await prisma.medicines.findMany({
    include: {
      medicine_stocks: true,
    },
  });

  return medicines.map((medicine) => {
    const stocksWithStatus = medicine.medicine_stocks.map((stock) => ({
      ...stock,
      is_expired: stock.expire_at <= now,
    }));

    // filter out expired stocks
    const validStocks = stocksWithStatus.filter((s) => !s.is_expired);
    const expiredStocks = stocksWithStatus.filter((s) => s.is_expired);

    const totalValidStock = validStocks.reduce(
      (sum, stock) => sum + stock.stock_amount,
      0
    );
    const totalExpiredStock = expiredStocks.reduce(
      (sum, stock) => sum + stock.stock_amount,
      0
    );
    return {
      ...medicine,
      medicine_stocks: withExpired ? stocksWithStatus : validStocks,
      valid_stock: totalValidStock,
      expired_stock: totalExpiredStock,
    };
  });
};

export const removeStock = async (medicalId, amount) => {
  const stock = await prisma.medicine_stocks.findMany({
    where: { medicine_id: medicalId },
    select: {
      medicine_id: true,
      stock_amount: true,
      expire_at: true,
    },
    orderBy: { expire_at: "asc" }, // sort by expiration date
  });
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
    logger.log(`Stock of medicine ${s.medicine_id} is low`);
  }
};

export const addStock = async (medicineId, amount, expireAt) => {
  const existingStock = await prisma.medicine_stocks.findFirst({
    where: {
      medicine_id: medicineId,
      expire_at: expireAt,
    },
  });

  if (existingStock) {
    return await prisma.medicine_stocks.update({
      where: { id: existingStock.id },
      data: { stock_amount: { increment: amount } },
    });
  } else {
    return await prisma.medicine_stocks.create({
      data: {
        medicine_id: medicineId,
        stock_amount: amount,
        expire_at: expireAt,
      },
    });
  }
};

// Check if medicine has available stock (excluding expired stock)
export const checkMedicineStock = async (medicineId) => {
  const now = new Date();
  
  const stockSum = await prisma.medicine_stocks.aggregate({
    where: { 
      medicine_id: medicineId,
      expire_at: {
        gt: now // Only include non-expired stock
      }
    },
    _sum: { stock_amount: true },
  });

  return stockSum._sum.stock_amount || 0;
};
