const express = require('express');
const userController = require('../controllers/userController');
const fileUpload = require('../middlewares/fileUpload');

const router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/login').post(userController.login);
router.route('/signup').post(fileUpload.single('image'), userController.signup);

module.exports = router;
