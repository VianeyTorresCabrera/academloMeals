const { Restaurant } = require('../models/restaurant.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const restaurantExists = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;

		const restaurant = await Restaurant.findOne({ where: { id } });

		if (!restaurant) {
			return (new AppError('Restaurant not found', 404));			
		}

		req.restaurant = restaurant;
		next();	
});
module.exports = { restaurantExists };
