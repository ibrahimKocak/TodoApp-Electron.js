const mysql = require("mysql")

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "electron"
})

connection.connect()

module.exports = {
    db : connection
}