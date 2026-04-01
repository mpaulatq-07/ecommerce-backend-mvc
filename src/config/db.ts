// Creamos el pool de conexiones

const connection = mysql.createPool({

host: "localhost",

user: "root",

password: "12345",

database: "ecommerce",

});



export default connection;

