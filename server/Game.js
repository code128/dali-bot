'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');

class Game {
	constructor(opts) {
		this.id = uuid.v4();
		// an array of phone numbers
		this.players = [];
		this.currentTurn = 0;
		// an array of urls pointing to the images produced by each game turn.
		this.imageList = [];

		if (opts && _.isArray(opts.players)) {
			this.players = this.players.concat(opts.players);
		}
	}
}

module.exports = Game;
