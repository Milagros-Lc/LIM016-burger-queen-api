#!/usr/bin/env node

const express = require('express');
const config = require('./config');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const routes = require('./routes');
const pkg =  require('../package.json');
const cors=require('cors')

const { port, dbUrl, secret } = config;
const app = express();

const corsOptions = {
  exposedHeaders: 'Link'
}

require('./database.js');

// TODO: Conexión a la Base de Datos (MongoDB o MySQL)
app.set('config', config);
app.set('pkg', pkg);
app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));


// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }

  app.use(errorHandler);

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
});
