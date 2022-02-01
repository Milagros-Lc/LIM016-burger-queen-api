const bcrypt = require("bcrypt");
const User = require("../models/users.js");
// const {getLink, isValidPassword, isValidEmail} = require("../extra/extra");
const mongoose = require("mongoose");
const res = require("express/lib/response");

const {pagination, isValidPassword, isValidEmail} = require("../utils/utils.js");
const { isAdmin } = require('../middleware/auth');
const ObjectId = require('mongoose').Types.ObjectId


const getUserByIdOrEmail = async (uid) => {
  if (!ObjectId.isValid(uid)) {
    const user = await User.findOne({email:`${uid}`});
    return user;
  }
  const user = await User.findOne({_id:`${uid}`});
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
    if (!user.roles.admin || req.authToken.uid !== user._id)
      return resp.status(403).json({ message: "no tienes permisos" });

    return resp.status(200).json(user);
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
    try{
      const uid = req.params.uid;
      const admin = await isAdmin(req)
      // console.log(uid)
      // console.log(req.params.uid)
      // console.log(ObjectId.isValid(uid))
      // console.log(admin)
      
      // resp.status(200).json(user);
      if (!uid) return resp.status(400).json({ message: "no provee de un id o email" });

      const user = await getUserByIdOrEmail(uid);
      //if(!ObjectId.isValid(uid)) return resp.status(404).json({message:'This product does not exist, please check the Id'})
      if (!user)
        return resp.status(404).json({ message: "el usuario solicitado no existe" });

      if(req.authToken.uid !== user._id.toString() && !admin) {
        return resp.status(403).json({ message: "es necesario ser admin o el dueño del usuario"})
      }

      let { email, password, roles } = req.body;

      if(roles && !admin)  return resp.status(403).json({ message: "no tienes permisos para realizar esta operación" });

      if (Object.entries(req.body).length === 0)
        return resp.status(400).json({ message: "Faltan datos para actualizar" });

      if (!password) (password = user.password);
      if (!email) (email = user.email);
      if (!roles) (roles = user.roles);
      
      //const value = ObjectId.isValid(uid) ? { _id: uid } : { email: uid };

      const userUpdate = await User.findByIdAndUpdate(
        { _id: `${user._id}`},
        { email, password: bcrypt.hashSync(password, 10), roles},
        { new: true, useFindAndModify: false }
      );
      return resp.status(200).json(userUpdate);
    } catch (err) {
      next(err)
    }
  },

  deleteUser: async (req, resp, next) => {
    const { uid } = req.params;

    const user = await getUserByIdOrEmail(uid);

    if (!user)
      return resp.status(404).json({ message: "el usuario no existe" });

    // console.log(req.authToken.roles.admin, req.authToken.uid === user._id);

    if (req.authToken.uid == user._id || req.authToken.roles.admin) {
      await User.findByIdAndDelete(user._id);
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