const bcrypt = require("bcrypt");
const User = require("../models/users.js");
// const {getLink, isValidPassword, isValidEmail} = require("../extra/extra");
const mongoose = require("mongoose");
const res = require("express/lib/response");
const {isAdmin}=require('../middleware/auth')
const {
  pagination,
  isValidPassword,
  isValidEmail,
} = require("../utils/utils.js");

const getUserByIdOrEmail = async (uid) => {
  if (mongoose.isValidObjectId(uid)) {
    const user = await User.findById(uid);
    return user;
  }
  const user = await User.findOne({ email: uid });
  return user;
};

//El método test() ejecuta la búsqueda de una ocurrencia entre una expresión regular y una cadena especificada. Devuelve true o false.
// const isValidateEmail = (email) => {
//   const emailRegex = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/i;
//   return emailRegex.test(email);
// };

module.exports = {
  getUsers: async (req, resp, next) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const users = await User.paginate({}, { limit, page });

      const url = `${req.protocol}://${req.get("host") + req.path}`;

      const links = pagination(users, url, page, limit, users.totalPages);
      resp.links(links);
      resp.status(200).json(users.docs);
    } catch (error) {
      next(error);
    }
  },

  createAdmi: async (adminEmail, adminPassword) => {
    const adminUser = {
      email: adminEmail,
      password: await User.encryptPassword(adminPassword),
      roles: { admin: true },
    };
    const user = new User(adminUser);
    console.info("admi creado");
    return await user.save();
  },

  getUserById: async (req, resp, next) => {
    const { uid } = req.params;

    const user = await getUserByIdOrEmail(uid);

    if (!user) return resp.status(404);

    // {403} si no es ni admin o la misma usuaria
    // console.log(req.authToken.uid, (user._id).toString());
    if (user.roles.admin || req.authToken.uid === (user._id).toString()){
      return resp.status(200).json(user);
    }
      
    return resp.status(403).json({ message: "no tienes permisos" });
  },

  postUser: async (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password)
      return resp.status(400).json({ message: "no ingresó  email o password" });

    if (!isValidEmail(email) || !isValidPassword(password))
      return resp.status(400).json({
        message: "el formato de la conraaseña o email no es correcto",
      });

    const userFind = await User.findOne({ email: email });

    if (userFind)
      return resp
        .status(403)
        .json({ message: "ya existe un usuario con ese email" });

    const newUser = new User({
      email,
      roles,
      password: await User.encryptPassword(password),
    });

    await newUser.save();
    return resp.status(200).json(newUser);
  },

  updateUser: async (req, resp, next) => {
    const { uid } = req.params;

    if (!uid)
      return resp.status(400).json({ message: "no provee de un id o email" });
    const user = getUserByIdOrEmail(uid);

    if (!user)
      return res
        .status(404)
        .json({ message: "el usuario solicitado no existe" });

    if (!req.authToken.roles.admin || user._id !== req.authToken.uid)
      return resp
        .status(403)
        .json({ message: "no tienes permisos para realizar esta operación" });

    if (Object.entries(req.body).length === 0)
      return resp.status(400).json({ message: "Faltan datos para actualizar" });

    const value = mongoose.isValidObjectId(uid) ? { _id: uid } : { email: uid };

    const userUpdate = await User.findByIdAndUpdate(
      value,
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );

    return resp.status(200).json(userUpdate);
  },

  deleteUser: async (req, resp, next) => {
    // console.log(isAdmin, req.authToken.uid ,user._id);
    const { uid } = req.params;

    const user = await getUserByIdOrEmail(uid);

    if (!user)
      return resp.status(404).json({ message: "el usuario no existe" });

    console.log(req.authToken.uid , (user._id).toString() , isAdmin);

    if ((req.authToken.uid === (user._id).toString() )|| isAdmin) {
      await User.findByIdAndDelete((user._id).toString());
      return resp.status(200).json({ message: "usuario elminado" });
    }
    return resp
      .status(403)
      .json({ message: "no tiene permisos para eliminar al usuario" });
  },
};

//isValidObjectId()se usa más comúnmente para probar un ID de objeto esperado

//el método parseInt lo convierte a un entero

// createUser: async (req, res, next) => {
//     try{
//       const { email, password, roles} = req.body;

//       if (!email || !password) return res.status(400).json({messge: 'Please make sure you have entered the data'})

//       if (!isValidPassword(password) || !isValidEmail(email)) res.status(400).json({messge: `Email or password don't meet the requirements`})

//       //verificar si ya existe el usuario para

//       const existUser = await User.findOne({email})

//       if(existUser) return res.status(403).json({messge: 'User already exist'})

//       const newUser = new User({
//       email,
//       password:bcrypt.hashSync(password, 10),
//       roles
//       });
//       await newUser.save();
//       res.status(200).json(newUser);
//     } catch (err) {
//       next(err)
//     }
//   }
