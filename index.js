const express = require("express");
const path = require("path");

require("dotenv").config();

//DB Config
require("./database/config").dbConnection();

//app express
const app = express();

// Lectura y parseo del Body
app.use(express.json());

//Node Serve
const server = require("http").createServer(app);
module.exports.io = require("socket.io")(server);
require("./sockets/socket");

//path publico
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

//Mis Rutas
app.use("/api/login", require("./routes/auth"));
app.use("/api/usuario", require("./routes/usuario"));
app.use("/api/mensajes", require("./routes/mensajes"));

server.listen(process.env.PORT, (err) => {
  if (err) throw new Error(err);

  console.log("Servidor corriendo en puerto", process.env.PORT);
});
