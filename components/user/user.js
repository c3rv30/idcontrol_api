const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { Schema } = mongoose;

// we create a user schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local'],
    required: true,
  },
  local: {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
  },
  fullname: {
    type: String,
    trim: true,
  },
  passResetKey: String,
  passKeyExpires: Number,
  createdAt: {
    type: Date,
    required: false,
  },
  updatedAt: {
    type: Number,
    required: false,
  },
}, { runSettersOnQuery: true });

/* 'runSettersOnQuery' is used to implement the specifications in our model schema such as the 'trim' option. */


userSchema.pre('save', async function(next) {
  try {
    this.local.email = this.local.email.toLowerCase(); // ensure email ar e in lowercase
    const currentDate = new Date().getTime();
    this.updatedAt = currentDate;
    if (!this.created_at) {
      this.createdAt = currentDate;
    }
    console.log('entered');
    if (this.method !== 'local') {
      next();
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash ( salt + hash )
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHash;
    console.log('exited');
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};
const User = mongoose.model('user', userSchema);

module.exports = User;
