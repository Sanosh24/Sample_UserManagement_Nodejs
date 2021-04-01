const { init } = require('../dbconnection');

module.exports.connect = async dbname => {
  const { status } = await init(dbname);
  if (status) {
    // load models
    require('./User');
  } else {
    process.exit(1);
  }
};
