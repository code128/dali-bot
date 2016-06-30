var express = require('express');
var handlers = require('./handlers');

var app = express();

var DALI_PORT = 4444;

function requestLogger(req, res, next) {
	console.log(req.method, req.url);
	next();
}

function run() {
	app.use(requestLogger);

	app.post('/api/games', handlers.createGame);
	app.get('/api/games/', handlers.listGames);
	app.get('/api/games/:id', handlers.getGame);
	app.put('/api/games/:id', handlers.updateGame);

	app.listen(DALI_PORT, function() { console.log('Dalibot listening on port ' + DALI_PORT); });
}

module.exports = {
	run: run
};
