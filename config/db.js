require('dotenv').config();

const { Client } = require('pg');

// Create a new client instance
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  database: 'studentCRUD',
  password: 'sagar123',
  port:  5432, // Default PostgreSQL port
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
