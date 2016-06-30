require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var handlers = require('./handlers');

var app = express();

function requestLogger(req, res, next) {
	console.log(req.method, req.url, req.body);
	next();
}

function run() {
	app.use(bodyParser.json());
	app.use(requestLogger);

	app.post('/api/games', handlers.createGame);
	app.get('/api/games/', handlers.listGames);
	app.get('/api/games/:id', handlers.getGame);
	app.put('/api/games/:id', handlers.updateGame);

	app.listen(process.env.SERVER_PORT, function() {
		console.log('Dalibot listening on port ' + process.env.SERVER_PORT);
	});
}

module.exports = {
	run: run
};
