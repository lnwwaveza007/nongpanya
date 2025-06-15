import prisma from "../config/prismaClient.js";

export const findUserById = async (id) => {
  return await prisma.users.findUnique({
    where: { id },
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email },
  });
};

export const createUser = async (data) => {
  return await prisma.users.create({
    data: {
      id: data.id,
      email: data.email,
      fullname: data.fullname,
      auth_provider: data.auth_provider,
      password: data.password || null,
      role: data.role || 'user',
    },
  });
};

export const getQuotaByUserId = async (id) => {
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
