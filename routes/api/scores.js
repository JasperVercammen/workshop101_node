var keystone = require('keystone');
//var User = keystone.list('User');
var Score = keystone.list('Score');



exports.getScore = function(req, res){
	// Check for required user input
	if(!req.query.user){
		return res.status(400).send({error: true, message: 'No user ID given.'});	
	}
	Score.model
		.find()
		.select('-_id score createdAt')
		.where('user', req.query.user)
		//.populate('user', '-_id name')
		.sort('-score')
		.limit(5)
		.exec(function(err, scores){
			if(err)
				return res.status(400).send({error: true, message: err});
			else if(!scores)
				return res.status(400).send({error: true, message: 'No scores found for given user.'});	
			else {
				return res.status(200).send({error: false, result: scores});
			}
		});
};


exports.postScore = function(req, res){
	// Check for required user input
		if(!req.body.user){
			return res.status(400).send({error: true, message: 'No user ID given.'});	
		} 
		if(!req.body.score){
			return res.status(400).send({error: true, message: 'No score given.'});	
		}
		// Check if user has more than 5 topscores (and what is the lowest)
		var score;

		Score.model
			.find()
			.select('-_id score')
			.where('user', req.query.user)
			.sort('score')
			.limit(5)
			.exec(function(err, scores){
			if(err)
				return res.status(400).send({error: true, message: err});
			else if(scores.length < 5) {
				score = new Score.model({
					score: req.body.score,
					user: req.body.user,
				});
			} else {
				score = scores[0];
				score.score = req.body.score;
			}
			console.log(score);
			score.save(function(err) {
				if (err) {
					return res.status(400).send({error: true, message: err});
				} else {
					return res.status(200).send({error: false, message: 'New score (' + score.score + ') inserted'});
				}
			});
		});

};


exports.getScoresTable = function(req, res){
	// Check for required user input
	
	res.status(200).send({result: 'getScoresTable'});
};