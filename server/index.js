require('dotenv').config();

var https = require('https');
var fs = require('fs');
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
	app.use('/public', express.static(process.cwd() + '/client'));

	app.post('/api/games', handlers.createGame);
	app.get('/api/games/', handlers.listGames);
	app.get('/api/games/:id', handlers.getGame);
	app.put('/api/games/:id', handlers.updateGame);

	var options = {
		key: fs.readFileSync(process.cwd() + '/ssl/server.key'),
		cert: fs.readFileSync(process.cwd() + '/ssl/server.crt')
	};

	https.createServer(options, app).listen(process.env.SERVER_PORT, function() {
		console.log('Dalibot listening over https on port ' + process.env.SERVER_PORT);
	});
}

module.exports = {
	run: run
};
