const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require('bcrypt');
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
 app.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(email, password);
    if (!email || !password) {
      return res.json({message:"No ingresaste correo o contraseña"});
    }
    let getUser = await User.findOne({email});
    //console.log(getUser)

    if(!getUser) {
      return res.json({message:"Usuario no encontrado"});
    }

    const isSamePassword = await bcrypt.compare(password, getUser.password)
    //console.log(isSamePassword)
    if(!isSamePassword) {
      return res.json({message:"Password invalido"})
    }

    const token = await jwt.sign({
      uid: getUser._id,
      email: getUser.email,
      roles: getUser.roles,
    }, secret, {expiresIn:"4h"})

   // console.log({ token })
    return res.json({ token })
    // TODO: autenticar a la usuarix
    //next();
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