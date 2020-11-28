const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'username null'] },
    email: { type: String, required: [true, 'email null'], unique: true },
    password: {
      type: String,
      required: [true, 'password null'],
      select: false,
      minlength: 6,
    },
    image: { type: String, required: [true, 'userimage null'] },
    places: [
      {
        type: mongoose.Types.ObjectId,
        require: [true, 'places null'],
        ref: 'Place',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
