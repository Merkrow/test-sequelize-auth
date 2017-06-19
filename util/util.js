const bcrypt = require('bcrypt');

const util = {
  generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  checkPassword(pw1, pw2) {
    return bcrypt.compareSync(pw1, pw2);
  }
}

module.exports.util = util;
