// Models
const { User } = require('./user.model');
const { Order } = require('./order.model');
const { Meal } = require('./meal.model');
const { Restaurant } = require('./restaurant.model');
const { Review } = require('./reviews.model');


const initModels = () => {
	// 1 restuarant <----> M reviews
	Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
	Review.belongsTo(Restaurant);

	// 1 User <------> M reviews
	User.hasMany(Review, { foreignKey: 'userId' });
	Review.belongsTo(User);

	// 1 restuarant <----> M meals
	Restaurant.hasMany(Meal, { foreignKey: 'restaurantId' });
	Meal.belongsTo(Restaurant);

// 1 order <-----------> 1 meal
Meal.hasOne(Order, {
	foreignKey: 'mealId'
});
Order.belongsTo(Meal);


// 1 user <-------- > M orders
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User);

};

module.exports = { initModels };

