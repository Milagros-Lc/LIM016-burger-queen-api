const jwt = require('jsonwebtoken');
const User = require("../models/users.js");


module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userFind = User.findById(decodedToken.uid);

    userFind
      .then((user) => {
        if(!user){
          return next(404)
        }
        req.authToken = decodedToken;
        return next();
      })
      .catch(() => next(403));
  });
};

module.exports.isAuthenticated = (req) => (
  req.authToken || false
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
);

module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  req.authToken.roles.admin || false
);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
