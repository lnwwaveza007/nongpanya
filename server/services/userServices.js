import prisma from "../config/prismaClient.js";

export const findUserById = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

export const createUser = async (id, email, fullname) => {
  return await prisma.users.create({
    data: {
      id,
      email,
      fullname,
    },
  });
};

export const getQouta = async (id) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const count = await prisma.requests.count({
    where: {
      user_id: id,
      status: 'completed',
      created_at: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    },
  });

  return count;
};
