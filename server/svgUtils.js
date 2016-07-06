var fs = require('fs'),
	path = require('path');

var basePath = process.cwd() + '/client_images';

function saveSvg(svg, fileName) {
	var filePath = path.join(basePath, fileName + '.svg'),
		f = fs.createWriteStream(filePath);
	f.write(svg);
	f.end();
	return path.join('/public_images', fileName + '.svg');
}

module.exports = {
	saveSvg: saveSvg
};
