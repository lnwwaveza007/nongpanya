import { PrismaClient } from '@prisma/client';
import { getConfig } from './envConfig.js';

// Get environment-specific configuration
const config = getConfig();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url
    }
  }
});

export default prisma;

