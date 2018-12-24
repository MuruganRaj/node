const mysql = require('mysql');
//.us-east-2.rds.amazonaws.com
// Set database connection credentials
const config = {
	host:'molcsec.cdvkpp4t1tij.us-east-2.rds.amazonaws.com',
user:'root',
password:'admin123',
port:3306,
database:'molc'

	
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
