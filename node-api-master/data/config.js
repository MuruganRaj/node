const mysql = require('mysql');
//.us-east-2.rds.amazonaws.com
// Set database connection credentials
const config = {
host:'139.59.57.',
user:'root',
password:'admin123',
port:3306,
database:'molc_'
	
};

// Create a MySQL pool
const pool = mysql.createPool(config);

// Export the pool
module.exports = pool;
