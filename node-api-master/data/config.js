const mysql = require('mysql');
//.us-east-2.rds.amazonaws.com
// Set database connection credentials
const config = {
host:'142.93.208.174',
user:'root',
password:'!admin123',
port:3306,
database:'molc_test'
	
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
