const express = require('express');
const { body, validationResult } = require('express-validator');

// Controllers
const {
	getAllOrdersUser,
    getOrderUserById,
	createUser,
	updateUser,
	deleteUser,
	login,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');

const { protectSession,
		protectUsersAccount,		
	 } = require('../middlewares/auth.middlewares');
const {
	createUserValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

usersRouter.post('/signup', createUserValidators, createUser);

usersRouter.post('/login', login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

usersRouter.get('/orders',  getAllOrdersUser);

usersRouter.get('/orders/:id', getOrderUserById);

module.exports = { usersRouter };
