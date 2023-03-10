const mongoose = require ("mongoose");
const config = require ('config');
require ('dotenv/config');

const { UserModel } = require ('../../source/models/user');

function connectToTestDB () {
	mongoose.set ('strictQuery', true);
	mongoose.connect (process.env.TEST_DB_URL, () => {
		if (config.get ('verbose_testing'))
			console.log ('MongoDB test db connected ...');
	});
}

async function deleteTestUsers () {
	delete_response = await UserModel.deleteMany ();

	if (config.get ('verbose_testing'))
		console.log ("users collection cleared, " + delete_response.deletedCount + " removed");
}

module.exports.connectToTestDB = connectToTestDB
module.exports.deleteTestUsers = deleteTestUsers
