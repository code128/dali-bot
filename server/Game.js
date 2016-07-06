'use strict';

var _ = require('lodash');
var uuid = require('node-uuid');
var svgUtils = require('./svgUtils');

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

	getCurrentPlayer() {
		return this.players[this.currentTurn];
	}

	saveTurn(image) {
		var fileName = this.id + '__' + this.currentTurn,
			svgPath = svgUtils.saveSvg(image, fileName);
		this.imageList.push(svgPath);
		this.currentTurn++;
	}

	isFinished() {
		return this.currentTurn >= this.players.length
	}
}

module.exports = Game;
