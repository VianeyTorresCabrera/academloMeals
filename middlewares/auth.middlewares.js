const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/reviews.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model')

dotenv.config({ path: './config.env' });


const protectSession = catchAsync(async (req, res, next) => {
	
		// Get token
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			// Extract token
			// req.headers.authorization = 'Bearer token'
			token = req.headers.authorization.split(' ')[1]; // -> [Bearer, token]
		}

		// Check if the token was sent or not
		if (!token) {
			return (new AppError('Invalid session', 403));
			
		}

		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Verify the token's owner
		const user = await User.findOne({
			where: { id: decoded.id, status: 'active' },
		});

		if (!user) {
			return (new AppError('The owner of the session is no longer active',403));
		}

		// Grant access
		req.sessionUser = user;//here I know who made the request 
		next();
	
});


// Create a middleware to protect the users accounts
const protectUsersAccount = async(req, res, next)=> {
	// Check the sessionUser to compare to the one that wants to be updated/deleted
	//extraer al usuario q quiero actualizar
	const { sessionUser, user } = req;
	const { id } = req.params; //another way//
 	
	if(sessionUser.id !== user.id){//verificar si el id del usuario en sesion es diferente al usuario encontrado
		//como no son iguales enviamos error
		return (new AppError('You are not the owner of this account', 403));		
	}
	// If the users (ids) don't match, send an error, otherwise continue

	next();	
	};

	//Create middleware to protect posts, only owners should be able to update/delete   
const protectRestaurantAccount = async(req, res, next) =>{
	const { sessionUser, review} =req;

	if(sessionUser.id !== review.userId){//si el id del usuario en sesion es diferente al id del dueño del post
		return (new AppError('This review does not belong to you', 403));		
	};
	req.review = review;
	next();
}
	
	//Create middleware to protect comments, only owners should be able to update/delete   
const protectMealAccount = async(req, res, next) =>{
	const { sessionUser, meal } =req; //return commentExists  

	if(!meal.restaurantId){
		return (new AppError('This restaurant does not exists', 403));				
	}

	req.meal = meal;
	next();
};

const protectOrderAccount = async(req, res, next) =>{
	//return commentExists  
	const { sessionUser, order } =req; //return commentExists  

	if(sessionUser.id !== order.userId){
		return (new AppError('This order does not belong  to you', 403));				
	}
	
	next();
};

//create middleware thaht only grants access to admin users
const protectAdmin = (req, res, next) => {
	const { sessionUser } = req;

	if( sessionUser.role !== 'admin'){
		return (new AppError('You do not have tha access level for this data.', 403));		
	}
	next();
};


module.exports = {
	protectSession,
	protectUsersAccount,
	protectRestaurantAccount,	
	protectMealAccount,
	protectOrderAccount,
	protectAdmin,
};
