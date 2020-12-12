const { io } = require("../index");
const { comprobarJWT } = require("../helpers/jwt");
const {
  usuarioConectado,
  usuarioDesconectado,
  grabarMesanje,
} = require("../controllers/socket");
//Mensajes de Sockets
io.on("connection", (client) => {
  console.log("Cliente conectado");
  console.log(client.handshake.headers["x-token"]);
  const [valido, uid] = comprobarJWT(client.handshake.headers["x-token"]);

  if (!valido) {
    return client.disconnect();
  }
  usuarioConectado(uid);

  //ingresar al usuario a una sala en particular
  //sala global
  client.join(uid);
  //Esuchar del cliente el mensaje-personal
  client.on("mensaje-personal", async (payload) => {
    //GRABAR MENSAJE
    await grabarMesanje(payload);
    io.to(payload.para).emit("mensaje-personal", payload);
  });

  client.on("disconnect", () => {
    usuarioDesconectado(uid);
    console.log("Cliente desconectado");
  });

  // client.on("mensaje", (payload) => {
  //   console.log(payload);
  //   io.emit("mensaje", { admin: "Nuevo mensaje" });
  // });
});
