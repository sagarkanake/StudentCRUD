const { Client } = require('pg');

// Create a new client instance
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Connect to the database
const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('Connection error', error.stack);
    process.exit(1);
  }
};

// Export the client and connection function
module.exports = { client, connectDB };
