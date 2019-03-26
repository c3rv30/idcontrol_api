const mongoose = require('mongoose');
const hash = require('../bcrypt');


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
  },
  roleUser: {
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

/* 'runSettersOnQuery' is used to implement the specifications
  in our model schema such as the 'trim' option. */


userSchema.pre('save', async function pre(next) {
  try {
    this.local.email = this.local.email.toLowerCase(); // ensure email ar e in lowercase
    const currentDate = new Date().getTime();
    this.updatedAt = currentDate;
    if (!this.created_at) {
      this.createdAt = currentDate;
    }
    console.log('entered to middleware');
    if (this.method !== 'local') {
      return next();
    }
    const pass = this.local.password;
    const passwordHash = await hash.genHash(pass);
    this.local.password = passwordHash;
    console.log('exited from middleware');
    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

userSchema.methods.isValidPassword = async function isVal(newPassword) {
  try {
    return await hash.compareBcrypt(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;
