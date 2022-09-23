const { Meal } = require('../models/meal.model');
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { protectOrderAccount } = require('../middlewares/auth.middlewares');

const getMeOrders = catchAsync( async (req, res, next) => {
	const { sessionUser } = req;
	const { order } = req;

	
		const neworder = await Order.findAll({ where: {status : 'active' , userId : sessionUser.id },
			include: [
				{
					model: User,
					attributes:{ exclude: ['password'] }
				},
				{ model: Meal,
					required:false,	
				 },
			],
		});

		res.status(200).json({
			status: 'success',
			data: {
				neworder,
			},
		});	
});

const createOrder = catchAsync( async (req, res, next) => {	
		const { quantity, mealId} = req.body;
		const { sessionUser} = req;		
		//obtenermos el precio de la comida de la tabla meal
		const meal = await Meal.findOne({
			where: { id : mealId, status: 'active' },
		});
		

		const newOrder = await Order.create({ 
			mealId, 
			userId: sessionUser.id, 
            quantity, 
			totalPrice: quantity * meal.price,
		} );
	
		res.status(201).json({
			status: 'success',
			data: { newOrder },
		});
	
});

const updateOrder = catchAsync( async (req, res, next) => {		
		const { order } = req;

		await order.update({  status: 'completed' });

		res.status(200).json({
			status: 'success',
			data: { order },
		});	
});

const deleteOrder = catchAsync( async (req, res, next) => {
	
		const { order } = req;

		await order.update({ status: 'deleted' });

		res.status(200).json({
			status: 'success',
		});	
});

module.exports = {
	getMeOrders,
	createOrder,
	updateOrder,
	deleteOrder,
};
