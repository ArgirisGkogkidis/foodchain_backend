const express = require('express');
const userController = require('./../controllers/userController');
const ingridientController = require('./../controllers/ingridientController')
const router = express.Router();

router.get('/ingridient/all', ingridientController.getAllIngridients);
router.get('/ingridient/:id', ingridientController.getIngridient);
router.post('/ingridient', ingridientController.createIngridient);

router.post('/register', userController.createUser);

router
  .route('/')
  .get(userController.getUserByWallet)
  .patch(userController.updateMe);
  // .post(userController.createUser);


router
  .route('/users')
  .get(userController.getAllUsers);
// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
