const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Meal } = require('../models/meal.model');
const { Order } = require('../models/order.model');
const { Restaurant } = require('../models/restaurant.model');


//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const getAllOrdersUser = catchAsync( async (req, res, next) => {
	
		const users = await User.findAll({
			attributes:{ exclude: ['password'] },
			where: { status: 'active' },
			include: [
				{
					model: Order,
					include: {
						model: Meal,						
					},
				},				
			],
		});

		res.status(200).json({
			status: 'success',
			data: {
				users,
			},
		});	
});

const getOrderUserById = catchAsync( async (req, res, next) => {
	
    const { id } = req.params;
    const user = await User.findOne({ where: { id,  status: 'active'} });

    res.status(200).json({
        status: 'success',
        data: { user },
    });	
});

const createUser = catchAsync( async (req, res, next) => {
	
		const { name, email, password, role } = req.body;

		if(role !== 'admin' && role !== 'normal'){
			return next(new AppError('Invalid role',400));
			
		}

		// Encrypt the password
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
			role,
		});

		// Remove password from response
		newUser.password = undefined;

		// 201 -> Success and a resource has been created
		res.status(201).json({
			status: 'success',
			data: { newUser },
		});
	
});

const updateUser = catchAsync( async (req, res, next) => {
	
		const { name, email } = req.body;
		const { user } = req;

		// Method 1: Update by using the model
		// await User.update({ name }, { where: { id } });

		// Method 2: Update using a model's instance
		await user.update({ name, email });

		res.status(200).json({
			status: 'success',
			data: { user },
		});	
});

const deleteUser = catchAsync( async (req, res, next) => {
	
		const { user } = req;

		// Method 1: Delete by using the model
		// User.destroy({ where: { id } })

		// Method 2: Delete by using the model's instance
		// await user.destroy();

		// Method 3: Soft delete
		await user.update({ status: 'deleted' });

		res.status(204).json({ status: 'success' });

});

const login = catchAsync( async (req, res, next) => {
	
		// Get email and password from req.body
		const { email, password } = req.body;

		// Validate if the user exist with given email
		const user = await User.findOne({
			where: { email, status: 'active' },
		});

		// Compare passwords (entered password vs db password)
		// If user doesn't exists or passwords doesn't match, send error
		if (!user || !(await bcrypt.compare(password, user.password)))
		{
			return next(new AppError('Wrong credentials', 400)); //enviando el error al global error handler para que el envie la respuesta
		}

		// Remove password from response
		user.password = undefined;

		// Generate JWT (payload, secretOrPrivateKey, options)
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: '30d',
		});

		res.status(200).json({
			status: 'success',
			data: { user, token },
		});
	
});

module.exports = {
	getAllOrdersUser,
    getOrderUserById,
	createUser,
	updateUser,
	deleteUser,
	login,
};
