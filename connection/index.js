require('dotenv').config()// require dotenv lib and func
var mysql = require('mysql2/promise') // 

var connection = mysql.createPool({
  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});


module.exports = {connection}