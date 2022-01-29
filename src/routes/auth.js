const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const config = require("../config");

const User = require("../models/users.js");

const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
     //voy a a capturar el email and password que me envia el usuario a través de req.body
 app.post("/auth", async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400).json({message:"No ingresaste correo o contraseña"});
    }
 
    // TODO: autenticar a la usuarix
    next();
  });

  return nextMain();
};

   //el método pertenece al MODELO del ususario (User)
    //pero tengo que utilizarlo desde su instancia(user)
    //es un metodo asincrono




//jwt m permite crear un token y tambien validarlo
//el me´rtodo SIGN m permitecrear un TOKEN
//necetsita un secrte para descrifar el algoritma para cifrar
//el token funciona como un pase 