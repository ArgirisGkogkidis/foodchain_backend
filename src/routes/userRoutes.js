const express = require('express');
const userController = require('./../controllers/userController');
const eventController = require('./../controllers/eventController');
const ingridientController = require('./../controllers/ingridientController')
const router = express.Router();
const Recipe = require('../models/recipeModel');
const { getPack } = require('../controllers/web3Controller');

router.get('/ingridient/all', ingridientController.getAllIngridients);
router.get('/ingridient/byId/:id', ingridientController.getIngridientByID);
router.get('/ingridient/:id', ingridientController.getIngridient);
router.put('/ingridient/:id', ingridientController.updateIngredient);
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

router.route('/events/mint').get(eventController.getAllEvents)
router.route('/events/mint/:id').get(eventController.getEventByUser)
router.route('/events/mint/').post(eventController.createEvent)

// Route to create a new recipe
router.post('/recipes', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).send(recipe);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.get('/recipes/:id', async (req, res) => {
  try {
    const doc = await Recipe.findById(req.params.id);
    if (!doc) {
      // If document is not found, send a 404 response
      return res.status(404).json({
        status: 'fail',
        message: 'No document found with that ID',
      });
    }
    // If document is found, send it back in the response
    res.status(200).json({
      status: 'success',
      data: {
        doc // No need to spread this into an array
      }
    });
  } catch (error) {
    // Send back a more specific error message based on the caught error
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});


router.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const recipeData = req.body;

  try {
    // Find the recipe by id and update it with the new data
    // { new: true } option returns the document after update
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, recipeData, { new: true });

    if (!updatedRecipe) {
      return res.status(404).send({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe updated successfully', data: updatedRecipe });
  } catch (error) {
    res.status(500).send({ message: 'Error updating recipe', error: error.message });
  }
});

router.get('/recipes/byOwner/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const recipes = await Recipe.find({ owner: walletAddress });
    res.send(recipes);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching recipes by owner', error });
  }
});


router.route('/pack-info/:packId').get(getPack);

module.exports = router;
