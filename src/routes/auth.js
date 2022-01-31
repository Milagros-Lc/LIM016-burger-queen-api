const {auth}=require('../controller/auth.js') 

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
  app.post("/auth", auth);
  return nextMain();
     //voy a a capturar el email and password que me envia el usuario a través de req.body
//  app.post("/auth", async (req, res, next) => {
//     const { email, password } = req.body;
//     // console.log(email, password);
//     if (!email || !password) {
//       return res.json({message:"No ingresaste correo o contraseña"});
//     }
//     let getUser = await User.findOne({email});
//     //console.log(getUser)

//     if(!getUser) {
//       return res.json({message:"Usuario no encontrado"});
//     }

//     const isSamePassword = await bcrypt.compare(password, getUser.password)
//     //console.log(isSamePassword)
//     if(!isSamePassword) {
//       return res.json({message:"Password invalido"})
//     }

//     const token = await jwt.sign({
//       uid: getUser._id,
//       email: getUser.email,
//       roles: getUser.roles,
//     }, secret, {expiresIn:"4h"})

//    // console.log({ token })
//     return res.json({ token })
//     // TODO: autenticar a la usuarix
//     //next();
//   });

  
};

