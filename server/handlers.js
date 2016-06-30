var Game = require('./Game');
var games = require('./games');

function createGame(req, res) {
	var game = new Game();

	games.add(game);
	res.send(game);
}

function updateGame(req, res) {
	res.send('updateGame success');
}

function getGame(req, res) {
	var id = req.params.id;
	var game = games.get(id);

	if (game) {
		res.send(game);
	} else {
		res.status(404);
	}
}

function listGames(req, res) {
	res.send(games.list());
}

module.exports = {
	createGame: createGame,
	updateGame: updateGame,
	getGame: getGame,
	listGames: listGames
};
