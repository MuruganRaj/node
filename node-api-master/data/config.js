const mysql = require('mysql');
//.us-east-2.rds.amazonaws.com
// Set database connection credentials
const config = {
	host:'com',
user:'root',
password:'admin123',
port:3306,
database:''

	
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
