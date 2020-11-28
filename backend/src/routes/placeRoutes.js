const express = require('express');
const placeController = require('../controllers/placeController');
const fileUpload = require('../middlewares/fileUpload');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router
  .route('/')
  .get(placeController.getAllPlaces)
  .post(checkAuth, fileUpload.single('image'), placeController.createNewPlace);
router.route('/user/:userId').get(placeController.getAllPlacesOfUser);
router
  .route('/:placeId')
  .get(placeController.getPlaceById)
  .patch(checkAuth, placeController.updatePlaceById)
  .delete(checkAuth, placeController.deletePlaceById);

module.exports = router;
