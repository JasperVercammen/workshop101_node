var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Score Model
 * ==========
 */

var Score = new keystone.List('Score', {track:true, drilldown: 'user'});

Score.add({
	user: {type: Types.Relationship, ref: 'User', initial: true, index: true, required: true},
	score: { type: Types.Number, initial: true, required: true, index: true },
});


/**
 * Registration
 */

Score.defaultColumns = 'user, score';
Score.register();
