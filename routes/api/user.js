var keystone = require('keystone');
var User = keystone.list('User');


exports.fbLogin = function(req, res){
	// Check for required user input
	res.status(200).send({result: 'fbLogin'});
};
