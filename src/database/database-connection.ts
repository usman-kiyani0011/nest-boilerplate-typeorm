// import * as mysql from 'mysql2/promise';

// export async function ensureDatabaseExists() {
//   const connection = await mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     port: Number(process.env.DATABASE_PORT) || 3306,
//     user: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//   });

//   try {
//     // Check if the database exists and create it if it doesn't
//     await connection.query(
//       `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\`;`,
//     );
//   } finally {
//     await connection.end();
//   }
// }
