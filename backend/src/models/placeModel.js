const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'title null'] },
    description: { type: String, required: [true, 'description null'] },
    image: { type: String, required: [true, 'image null'] },
    address: { type: String, required: [true, 'address null'] },
    location: {
      lat: { type: Number, required: [true, 'lattitude null'] },
      lng: { type: Number, required: [true, 'longitude null'] },
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: [true, 'creator id null'],
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Place', placeSchema);
