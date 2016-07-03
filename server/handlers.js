var Game = require('./Game');
var games = require('./games');
var apiClient = require('./apiClient');

function createGame(req, res) {
	var game = new Game(req.body);
	games.add(game);

	apiClient.wraps.createPersonalized(process.env.WRAP_ID_GAMEPLAY, {
			personalized_json: {},
			metadata: {
				gameID:game.id,
				turnID:game.currentTurn,
				lastSVG:game.imageList.slice(-1)
			},
			tags: 'dalibot, hackathon'
		})
		.then(function(gameplayWrap) {
			return apiClient.wraps.share(gameplayWrap.id, {
				phone_number: game.getCurrentPlayer(),
				type: 'sms',
				body: 'Play Exquisite Wrap! {{wrap}}'
			});
		})
		.then(function(body) {
			res.send(game);
		})
		.catch(function(errorRes) {
			games.remove(game.id);
			res.status(500).send(errorRes.body);
		});
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
