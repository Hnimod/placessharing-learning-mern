const mongoose = require('mongoose');
const fs = require('fs');
const getCoordsForAddress = require('../utils/location');
const catchAsync = require('../utils/catchAsync');
const Place = require('../models/placeModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllPlaces = catchAsync(async (req, res, next) => {
  const places = await Place.find();

  res.status(200).json({
    status: 'success',
    data: {
      results: places.length,
      places,
    },
  });
});

exports.createNewPlace = catchAsync(async (req, res, next) => {
  const { title, description, address } = req.body;
  const coordinates = await getCoordsForAddress(address);

  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User does not exist', 404));

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    image: req.file.location,
    address,
    creator: req.user.id,
  });

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    try {
      await createdPlace.save({ session });
      user.places.push(createdPlace);
      await user.save({ session });
      return Promise.resolve('OK');
    } catch (err) {
      session.endSession();
      return Promise.reject(err);
    }
  });
  session.endSession();

  res.status(201).json({
    status: 'success',
    data: { place: createdPlace },
  });
});

exports.getAllPlacesOfUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return next(new AppError('Could not find user with the Id', 404));
  const places = await Place.find({ creator: userId });

  res.status(200).json({
    status: 'success',
    data: {
      results: places.length,
      places,
    },
  });
});

exports.getPlaceById = catchAsync(async (req, res, next) => {
  const { placeId } = req.params;
  const place = await Place.findById(placeId);
  if (!place)
    return next(new AppError('Could not find place with the id', 404));

  res.status(200).json({
    status: 'success',
    place,
  });
});

exports.updatePlaceById = catchAsync(async (req, res, next) => {
  const { title, description, address } = req.body;
  const { placeId } = req.params;
  let place = await Place.findById(placeId);
  if (!place)
    return next(new AppError('Could not find place with the id', 404));

  if (place.creator.toString() !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  await Place.findByIdAndUpdate(
    placeId,
    { title, description, address },
    { runValidators: true }
  );
  place = await Place.findById(placeId);

  res.status(200).json({
    status: 'success',
    data: { place },
  });
});

exports.deletePlaceById = catchAsync(async (req, res, next) => {
  const { placeId } = req.params;
  const place = await Place.findById(placeId).populate('creator');
  if (!place)
    return next(new AppError('Could not find place with the iD', 404));

  if (place.creator.id !== req.user.id) {
    return next(
      new AppError('You do not have permission to perform this action', 401)
    );
  }

  const imagePath = place.image;
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    try {
      place.creator.places.pull(place);
      await place.creator.save({ session });
      await place.remove({ session });
      return Promise.resolve('OK');
    } catch (err) {
      session.endSession();
      return Promise.reject(err);
    }
  });
  session.endSession();

  fs.unlink(imagePath, (err) => {
    if (err) {
      return next(new AppError(err.message, 500));
    }
  });
  res.status(204).json({});
});
