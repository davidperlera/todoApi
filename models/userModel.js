const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    tasks: [
        {
            tittle: {
                type: String,
                required: true,
            },
            description: {
                type: String,
            },
            completed: {
                type: Boolean,
                default: false,
            },
        },
    ],
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });

const User = mongoose.model('User', userSchema);

module.exports = User;