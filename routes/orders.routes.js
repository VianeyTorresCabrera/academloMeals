const express = require('express');
const { body, validationResult } = require('express-validator');

// Controllers
const {
	getMeOrders,
	createOrder,
	updateOrder,
	deleteOrder,
} = require('../controllers/orders.controller');

// Middlewares
const { orderExists } = require('../middlewares/orders.middlewares');
const { mealExists } = require('../middlewares/meals.middlewares');


const { protectSession,
		protectUsersAccount,
		protectAdmin,
		protectMealAccount,
		protectOrderAccount,
	 } = require('../middlewares/auth.middlewares');
const {
	createUserValidators,	
} = require('../middlewares/validators.middlewares');
const { userExists } = require('../middlewares/users.middlewares');

const ordersRouter = express.Router();
// Protecting below endpoints
ordersRouter.use(protectSession);

ordersRouter.post('/', createOrder);

ordersRouter.get('/me', getMeOrders);

ordersRouter.patch('/:id', orderExists , updateOrder);

ordersRouter.delete('/:id', orderExists , deleteOrder);

module.exports = { ordersRouter };
