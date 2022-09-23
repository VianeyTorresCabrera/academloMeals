const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/appError.util');

const checkValidations = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
		const errorMessages = errors.array().map(err => err.msg);

		const message = errorMessages.join('. ');
		
		return next(new AppError(message, 400));			
	}

	next();
};

const createUserValidators = [
	body('name')
		.isString()
		.withMessage('Name must be a string')
		.notEmpty()
		.withMessage('Name cannot be empty')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),
	body('email').isEmail().withMessage('Must provide a valid email'),
	body('password')
		.isString()
		.withMessage('Password must be a string')
		.notEmpty()
		.withMessage('Password cannot be empty')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters'),
	checkValidations,
];

const createMealValidators = [
	body('name')
		.isString()
		.withMessage('Name must be a string')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),
	body('price')
		.isNumeric()
		.withMessage('Content must be a number')
		.isLength({ min: 1 })
		.withMessage('Content must be at least 1 characters long'),
	checkValidations,
];

const createRestaurantValidators = [
	body('name')
		.isString()
		.withMessage('Title must be a string')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),
	body('address')
		.isString()
		.withMessage('Address must be a string')
		.isLength({ min: 5 })
		.withMessage('Address must be at least 3 characters'),
	body('rating')
		.isNumeric({min:1,max:5})
		.withMessage('Content must be a number')
		.isLength({ min: 1 })
		.withMessage('Content must be at least 1 characters long'),
	checkValidations,
];

const createReviewValidators = [
	body('comment')
		.isString()
		.withMessage('Comment must be a string')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),	
	body('rating')
		.isNumeric({min:1,max:5})
		.withMessage('Rating must be a number')
		.isLength({ min: 1 })
		.withMessage('Rating must be at least 1 characters long'),
	checkValidations,
];



module.exports = { 
	createUserValidators, 
	createRestaurantValidators, 
	createMealValidators, 
	createReviewValidators,
};
