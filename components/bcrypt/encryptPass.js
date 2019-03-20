const bcrypt = require('bcrypt');

module.exports = {
  genHash: async (pass) => {
    // Generate salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    // Generate a password hash ( salt + hash )
    const passwordHash = await bcrypt.hash(pass, salt);
    // Re-assign hashed version over original, plain text password
    return passwordHash;
  },
};
