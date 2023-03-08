const express = require ('express');
const bcryptjs = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

const router = express.Router ();

const { UserModel } = require ('../models/user');
const {
	registerValidation,
	signInValidation
} = require ('../validations/validation');

router.post ('/register', async (req, res) => {
	try {
		const {error} = registerValidation (req.body);

		if (error)
			return res.status (400).send ({message: error ['details'] [0] ['message']});

		const salt = await bcryptjs.genSalt (5);
		const hashedPassword = await bcryptjs.hash (req.body.password, salt);

		new_user = await UserModel.create ({
			screen_name: req.body.screen_name,
			email: req.body.email,
			password: hashedPassword
		});

		res.send (new_user);
	}
	catch (err) {
		if (err.code == 11000)
			msg = "User already exists";
		else
			msg = err

		res.status (400).send ({ message: msg });
	}
})

router.post ('/sign-in', async (req, res) => {
	try {
		const {error} = signInValidation (req.body);

		if (error)
			return res.status (400).send ({message: error ['details'] [0] ['message']});

		const user = await UserModel.findOne ({email: req.body.email});

		if (! user)
			return res.status (400).send ({message: 'User does not exist.'});

		validPassword = await bcryptjs.compare (req.body.password, user.password);
		if (! validPassword)
			return res.status (400).send ({message: 'Password is not correct.'});

		const token = jwt.sign ({_id: user._id}, process.env.JWT_SECRET);

		res.header ('auth-token', token).send ({'auth-token': token});
	}
	catch (err) {
		res.status (400).send ({ message: err });
	}
})

module.exports = router;