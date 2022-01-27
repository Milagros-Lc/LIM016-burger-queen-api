const mongoose = require('mongoose');
const config = require('./config');

mongoose
  .connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log('exito'))
  .catch(console.error);
const { connection } = mongoose;

connection.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('BD is connected');
});
