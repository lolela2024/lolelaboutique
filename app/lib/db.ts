// import { Pool } from '@neondatabase/serverless'
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { PrismaClient } from '@prisma/client';
// import { createPool } from '@vercel/postgres';


// const prismaClientSingleton = () => {
//   const pool = createPool({connectionString:process.env.POSTGRES_PRISMA_URL})
//   const adapter = new PrismaNeon(pool);
//   const prisma = new PrismaClient();
  
//   return prisma
// };

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;


import { PrismaClient } from '@prisma/client';
import { createPool } from '@vercel/postgres';

const prismaClientSingleton = () => {
  const connectionString = "postgres://default:YjnC4xfMoQg6@ep-gentle-unit-a2iz9dod-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
  
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not defined in environment variables.");
  }

  const pool = createPool({ connectionString });

  const prisma = new PrismaClient();

  prisma.$connect = async () => {
    await pool.connect();
  };

  return prisma;
};

declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;