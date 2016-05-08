var keystone = require('keystone');
var User = keystone.list('User');

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;


passport.use(new Strategy({
		clientID: '1247012835314824',
		clientSecret: 'c4e99472659115177dd47e8c70a20ae7',
		callbackURL: 'http://localhost:3000/api/facebook-login-return'
	},
	function(accessToken, refreshToken, profile, cb) {
		// In this example, the user's Facebook profile is supplied as the user
		// record.  In a production-quality application, the Facebook profile should
		// be associated with a user record in the application's database, which
		// allows for account linking and authentication with other identity
		// providers.
		return cb(null, profile);
	}
));


passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


exports.fbLogin = function(req, res){
	// Check for required user input
	passport.authenticate('facebook');
	res.send('Erin he');
};

exports.fbLoginReturn = function(req, res){
	passport.authenticate('facebook', { failureRedirect: '/login' });
	res.status(200).send({error: false, message: 'loggedIN'});
};

exports.fbConnected = function(req, res){
	require('connect-ensure-login').ensureLoggedIn();
	
	res.status(200).send({error: false, message: req.user});
}