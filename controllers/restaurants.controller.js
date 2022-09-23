const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/reviews.model');
const { Meal } = require('../models/meal.model');
const { User } = require('../models/user.model')

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { protectSession } = require('../middlewares/auth.middlewares');

const getAllRestaurants = catchAsync( async (req, res, next) => {

		const restaurant = await Restaurant.findAll({
            where: { status: 'active'},
			include: [{
                model: Review, 
                atributes:['id', 'comment', 'rating'], 
                include: { model: User,attributes:{ exclude: ['password', 'role'] } }
        }]
		});

		res.status(200).json({
			status: 'success',
			data: {
				restaurant,
			},
		});	
});

const getRestaurantById = catchAsync( async (req, res, next) => {
	
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ where: { id,  status: 'active'} });

    res.status(200).json({
        status: 'success',
        data: { restaurant },
    });	
});

const createRestaurant = catchAsync( async (req, res, next) => {
	
		const { name, address, rating } = req.body;
		const { sessionUser } = req;

		const newRestaurant = await Restaurant.create({ 
            name,
            address,
             rating,            
         });

		res.status(201).json({
			status: 'success',
			data: { newRestaurant },
		});
	
});

const updateRestaurant = catchAsync( async (req, res, next) => {
	
		const { name, address } = req.body;
		const { restaurant } = req;

		await restaurant.update({ name, address });

		res.status(200).json({
			status: 'success',
			data: { restaurant },
		});	
});

const deleteRestaurant = catchAsync( async (req, res, next) => {
	
		const { restaurant } = req;

		await restaurant.update({ status: 'deleted' });

		res.status(200).json({
			status: 'success',
		});
	
});

const createRestaurantReview = catchAsync( async (req, res, next) => {
	const { restaurantId } = req.params;
    const { comment, rating } = req.body;
    const { sessionUser } = req;

    
    const newRestaurantReview = await Review.create({ 
        userId : sessionUser.id,   
        comment,
        restaurantId : restaurantId,
        rating,              
     });

    res.status(201).json({
        status: 'success',
        data: { newRestaurantReview },
    });

});


const updateRestaurantReview = catchAsync( async (req, res, next) => {
	
    const { comment, rating } = req.body;
    const { review, sessionUser } = req;

    await Review.update({              
        comment,   
        rating,
    }, { where: { userId : sessionUser.id }});

    res.status(200).json({
        status: 'success',
        data: { review },
    });	
});

const deleteRestaurantReview = catchAsync( async (req, res, next) => {
	
    const { review, sessionUser } = req;


    await review.update({ status: 'deleted' }, { where: { userId : sessionUser.id }});

    res.status(200).json({
        status: 'success',        
    });

});

module.exports = {
	getAllRestaurants,
    getRestaurantById,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
    createRestaurantReview,
    updateRestaurantReview,
    deleteRestaurantReview,    
};
