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
		.select('-_id score updatedAt')
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
			.where('user', req.body.user)
			.sort('-score')
			.limit(5)
			.exec(function(err, scores){
			if(err)
				return res.status(400).send({error: true, message: err});
			else if(scores.length < 5) {
				// new score model (New until there are 5 in the db)
				// We set the score later on
				score = new Score.model({
					score: 0,
					user: req.body.user
				});
			} else {
				// Use the last (lowest) score in the DB
				score = scores[4];
			}
			if(score.score < req.body.score){
				// SET score value
				score.score = req.body.score;
				// Save the score
				score.save(function(err) {
					if (err) return res.status(400).send({error: true, message: err});
					else return res.status(200).send({error: false, message: 'New score (' + score.score + ') inserted'});
				});
			}
			else {
				return res.status(200).send({error: false, message: 'No score inserted, other scores where higher.'});
			}
		});

};


exports.getScoresTable = function(req, res){
	// Check for required user input
	Score.model.find().select('-_id score updatedAt user').populate('user', '-_id name').sort('-user -score').exec(function(err, scores){
		if(err) return res.status(400).send({error: true, message: err});
		var old_user = '';
		var result = [];
		var index = -1;
		scores.forEach(function(score){
			var username = score.user.name.first + ' ' + score.user.name.last;
			if(username === old_user){
				result[index].scores.push({score: score.score, date: score.updatedAt}); 
			} else {
				index += 1;
				old_user = username;
				result[index] = {
					name: username,
					highscore: score.score,
					date: score.updatedAt,
					scores: [{score: score.score, date: score.updatedAt}]
				};
			}
		});

		res.status(200).send({error: false, result: result});
	});
};