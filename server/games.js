var _ = require('lodash');

var games = [];

function list() {
	return games;
}

function add(game) {
	games.push(game);
}

function get(id) {
	return _.find(games, { id });
}

function remove(id) {
	var game = get(id);
	if (game) {
		_.remove(games, game);
	}
}

module.exports = {
	list: list,
	add: add,
	get: get,
	remove: remove
};
