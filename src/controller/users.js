const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const {getLink, isValidPassword, isValidEmail} = require("../extra/extra");

module.exports = {
  getUsers: async (req, resp, next) => {
    try{
      const limit = parseInt(req.query.limit, 10) || 4;
      const page = parseInt(req.query.page, 10) || 1;
      console.log(req.protocol)
      console.log(req.headers.host)
      console.log(req.path)

      const users = await User.paginate({}, {limit, page});
      
      const URL = `${req.protocol}://${req.headers.host + req.path}`;
      console.log(URL)
      console.log(`${URL}?limit=${limit}&page=1`)
      console.log(page)

      const link = getLink(users, URL, page, limit, users.totalPages )
      /*La función res.links() se utiliza para unir los enlaces proporcionados como propiedades 
      del parámetro para completar el campo de encabezado HTTP de enlace de la respuesta.*/
      resp.links(link)

      return resp.status(200).json(users);
    } catch (err) {
      next(err)
    }
  },
  createUser: async (req, res, next) => {
    try{
      const { email, password, roles} = req.body;

      if (!email || !password) return res.status(400).json({messge: 'Please make sure you have entered the data'})

      if (!isValidPassword(password) || !isValidEmail(email)) res.status(400).json({messge: `Email or password don't meet the requirements`})

      //verificar si ya existe el usuario para

      const existUser = await User.findOne({email})

      if(existUser) return res.status(403).json({messge: 'User already exist'})
      
      const newUser = new User({ 
      email, 
      password:bcrypt.hashSync(password, 10), 
      roles
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (err) {
      next(err)
    }
  }
};
