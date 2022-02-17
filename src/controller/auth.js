const User = require("../models/users.js");
const config = require("../config");
const { secret } = config;
const jwt = require("jsonwebtoken");

module.exports = {
  auth: async (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      //  {400} si no se proveen `email` o `password` o ninguno de los dos
      return resp.status(400).json({ message: "No ingresaste correo o contraseña" });
    }

    // TODO: autenticar a la usuarix
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      return resp.status(404).json({ message: "El usuario no existe" });
    }
    const matchPassword = await User.comparePassword(
      password,
      findUser.password
    );

    if (!matchPassword) return resp.status(404).json({  message: "La contraseña es incorrecta, intente de nuevo" });

    const token = jwt.sign(
      { uid: findUser._id, email: findUser.email, roles: findUser.roles },
      secret,
      { expiresIn: 86400 }
    );

    resp.status(200).json({ token: token });
  },
};

//jwt m permite crear un token y tambien validarlo
//el método SIGN me permitecrear un TOKEN
//voy a cear un TOKEN con la INFORMACION del usuario
//cuando voy a verificar TOKEN del usuario utilizo el metodo VERIFY
//necesita un secret para descrifar el algoritmo para cifrar
//el token funciona como un pase

// SIGN-------->CREA EL TOKEN (",xkmv kmfv")
// VERIFY------------>VERIFICA QUE EL TOKEN SEA EL CORRECTO
