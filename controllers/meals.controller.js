// Models
const { Restaurant  } = require('../models/restaurant.model');
const { User } = require('../models/user.model');
const { Order } = require('../models/order.model');
const { Meal } = require('../models/meal.model')

//utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllMeals = catchAsync( async (req, res, next) => {
	
		const meals = await Meal.findAll({  where: { status : 'active' }
			/*attributes: ['id', 'title', 'content', 'createdAt'],
			include: [
				{ model: User, attributes: ['id', 'name'] },
				{
					model: Comment,
					required: false,//apply outer join 
					attributes: ['id', 'comment', 'createdAt'],
				},
			],*/
		});

		res.status(200).json({
			status: 'success',
			data: {
				meals,
			},
		});	
});

const getMealById = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;
		const meal = await Meal.findOne({ where: { id,  status: 'active'} });

		res.status(200).json({
			status: 'success',
			data: { meal },
		});	
});


const createMeal = catchAsync( async (req, res, next) => {
		const { id } = req.params;
		const { name , price } = req.body;
		//const { restaurant } = req; //id del restaurant

		const newMeal = await Meal.create({ 
			name, 
			price, 
			restaurantId: id,
			 //id del restaurante
		});

		res.status(201).json({
			status: 'success',
			data: { newMeal },
		});
	
});

const updateMeal = catchAsync(async (req, res, next) => {
	
		const { name, price } = req.body;
		const { meal } = req;

		await meal.update({ name, price });

		res.status(200).json({
			status: 'success',
			data: { meal },
		});
	
});

const deleteMeal = catchAsync(async (req, res, next) => {
	
		const { meal } = req;

		await meal.update({ status: 'deleted' });

		res.status(200).json({
			status: 'success',
		});	
});

module.exports = {
	getAllMeals,
	getMealById,
	createMeal,
	updateMeal,
	deleteMeal,
};
