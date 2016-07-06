var Game = require('./Game');
var games = require('./games');
var apiClient = require('./apiClient');
var Promise = require('bluebird');

function createGame(req, res) {
	var game = new Game(req.body);
	games.add(game);

	var card_id = process.env.TURN_CARD_ID;

	apiClient.wraps.createPersonalized(process.env.WRAP_ID_GAMEPLAY, {
		personalized_json: { card_id: {
      		"turn_id": game.currentTurn
      		}
    	},
		metadata: {
			gameID: game.id,
			turnID: game.currentTurn
		}
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
	console.log('update game', req.params.id);

	var gameId = req.params.id,
		turnId = req.body.turnID,
		image = req.body.image,
		game = games.get(gameId);

	console.log('game', game);

	game.saveTurn(image)

	if (game.isFinished()) {
		console.log('game is finished', game.imageList);

		apiClient.wraps.createPersonalized(process.env.WRAP_ID_RESULTS, {
			personalized_json: {},
			metadata: {
				gameID: game.id,
				image: game.imageList.slice(-1)
			}
		})
			.then(function(gameplayWrap) {
				console.log('personalized wrap');
				return Promise.map(game.players, (player) => {
					return apiClient.wraps.share(gameplayWrap.id, {
						phone_number: player,
						type: 'sms',
						body: 'View your finished Exquisite Wrap! {{wrap}}'
					});
				});
			})
			.then(function(body) {
				console.log('shared wrap');
				res.send(game);
			})
			.catch(function(errorRes) {
				console.log('error', errorRes);
				res.status(500).send(errorRes.body);
			});
	} else {
		console.log('next turn', game.currentTurn, game.getCurrentPlayer());
		apiClient.wraps.createPersonalized(process.env.WRAP_ID_GAMEPLAY, {
			personalized_json: {},
			metadata: {
				gameID: game.id,
				turnID: game.currentTurn,
				lastSVG: game.imageList.slice(-1)
			}
		})
			.then(function(gameplayWrap) {
				console.log('personalized wrap');
				return apiClient.wraps.share(gameplayWrap.id, {
					phone_number: game.getCurrentPlayer(),
					type: 'sms',
					body: 'It\'s your turn at Exquisite Wrap! {{wrap}}'
				});
			})
			.then(function(body) {
				console.log('shared wrap');
				res.send(game);
			})
			.catch(function(errorRes) {
				console.log('error', errorRes);
				res.status(500).send(errorRes.body);
			});
	}
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
