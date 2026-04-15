import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './src/drizzle/migration',
//   schema: './src/drizzle/schema.ts',
//   dialect: 'mysql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });

export default defineConfig({
  dialect: "mysql", 
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migration",
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
    ssl: "true"
  },
});
