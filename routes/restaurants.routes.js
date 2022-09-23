const express = require('express');
const { body, validationResult } = require('express-validator');

// Controllers
const {
    getAllRestaurants,
    getRestaurantById,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
    createRestaurantReview,
    updateRestaurantReview,
    deleteRestaurantReview,
} = require('../controllers/restaurants.controller');

// Middlewares
const { restaurantExists } = require('../middlewares/restaurants.middlewares');
const { reviewExists } = require('../middlewares/reviews.middlewares');


const { protectSession,
		protectUsersAccount,
		protectAdmin,
		protectRestaurantAccount,
	 } = require('../middlewares/auth.middlewares');
const {
	createRestaurantValidators,
	createReviewValidators,
} = require('../middlewares/validators.middlewares');

const restaurantsRouter = express.Router();


restaurantsRouter.get('/', getAllRestaurants);

restaurantsRouter.get('/:id', getRestaurantById);

// Protecting below endpoints
restaurantsRouter.use(protectSession);

restaurantsRouter.post('/', createRestaurantValidators, createRestaurant);

restaurantsRouter.patch('/:id', restaurantExists, protectAdmin, updateRestaurant);

restaurantsRouter.delete('/:id', restaurantExists, protectAdmin, deleteRestaurant);

//reviews

restaurantsRouter.post('/reviews/:restaurantId', createReviewValidators,  createRestaurantReview);

restaurantsRouter.patch('/reviews/:id', reviewExists, protectRestaurantAccount, updateRestaurantReview);

restaurantsRouter.delete('/reviews/:id', reviewExists, protectRestaurantAccount, deleteRestaurantReview);

module.exports = { restaurantsRouter };
