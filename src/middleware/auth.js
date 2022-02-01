/* eslint-disable no-console */
const jwt = require("jsonwebtoken");
const User = require("../models/users.js");

module.exports = (secret) => (req, resp, next) => {
  //autorización del header
  const { authorization } = req.headers;

  if (!authorization) {
    console.info("no provee un token");
    return next();
  }

  const [type, token] = authorization.split(" ");

  if (type.toLowerCase() !== "bearer") {
    return next();
  }

  // TODO: Verificar identidad del usuario usando `decodeToken.uid`

  //Se va a verificar el token del ususario , voy a obtener la INFO  con la cual se creo el TOKEN
  //la INFO tiene el uid, email, roles del usuario
  //Se extrae un objeto(decodedToken) que contiene el id del usuario
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    console.log(decodedToken);

    const userFind =  User.findById(decodedToken.uid);
    // if (!userFind)
    //   resp.status(404).json({ message: "no se aha encontrado al usuario" });

    // //se va a guardar en el req el decodedToken
    // req.authToken = decodedToken;
    // return next();


    userFind
    .then((doc) => {
      if (!doc) {
        return next(404);
      }
      req.authToken = decodedToken;

      return next();
    })
    .catch(() => next(403));

  });
};

module.exports.isAuthenticated = (req) =>
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  // el operador "||" devuelve true si alguno de los operandos es true
  req.authToken || false;

module.exports.isAdmin = (req) =>
  // TODO: decidir por la informacion del request si la usuaria es admin
  req.authToken.roles.admin || false;


module.exports.requireAuth = (req, resp, next) =>
  !module.exports.isAuthenticated(req) ? next(401) : next();

module.exports.requireAdmin = (req, resp, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
    ? next(403)
    : next();

//minuto 1:37
