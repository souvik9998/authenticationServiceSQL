import mysql from "mysql";
const db = mysql.createConnection({
    host: "database-2.canjnlb2rm7z.eu-north-1.rds.amazonaws.com",
    port : "3306",
    user : "admin",
    password : "Souvik9998##++",
    database : "mydb"
})
export default db;