const express = require('express');

// Controllers
const {
	getAllMeals,
    getMealById,
	createMeal,
	updateMeal,
	deleteMeal,
} = require('../controllers/meals.controller');

// Middlewares
const { mealExists} = require('../middlewares/meals.middlewares');
const { restaurantExists } = require('../middlewares/restaurants.middlewares');
const { protectSession,
	protectUsersAccount,
	protectAdmin,
 } = require('../middlewares/auth.middlewares');

 const { createMealValidators } = require('../middlewares/validators.middlewares');

const mealsRouter = express.Router();


mealsRouter.use(protectSession);


mealsRouter.get('/', getAllMeals);

mealsRouter.get('/:id', getMealById);

mealsRouter.post('/:id', createMealValidators, restaurantExists, createMeal);

mealsRouter.patch('/:id', mealExists,protectAdmin, updateMeal);

mealsRouter.delete('/:id', mealExists, protectAdmin, deleteMeal);

module.exports = { mealsRouter };

