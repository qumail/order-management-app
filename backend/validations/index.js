const menuValidation = require('./menuValidation');
const orderValidation = require('./orderValidation');

module.exports = {
  ...menuValidation,
  ...orderValidation
};