var fs = require('fs');
var _ = module.exports = {};
var iconv;


_.isJsFile = function(path) {
	return /\.js$/i.test(path);
}
_.isCssFile = function(path) {
	return /\.css$/i.test(path);
}

_.isExistFile = function(path) {
	return fs.existsSync(path);
}

_.isFile = function(path) {
	var stats = fs.statSync(path);

	return stats.isFile();
}

_.isDirectory = function(path) {
	var stats = fs.statSync(path);

	return stats.isDirectory();
}

_.readFile = function(path, callback) {

	if (_.isExistFile(path)) {
		fs.readFile(path, callback);
	} else {
		throw new Error('unable to find [' + path + "]; No such file or directory");
	}

}

_.readFileSync = function(path) {
	if (_.isExistFile(path)) {
		return fs.readFileSync(path);
	} else {
		throw new Error('unable to find [' + path + "]; No such file or directory");
	}
}
_.readJSON = function(path) {
	var buffer = _.readFileSync(path),
		result = {},
		content = _.readBuffer(buffer);
	try {
		result = JSON.parse(content);
	} catch (e) {
		throw new Error('parse json file[' + path + '] fail, error [' + e.message + ']');
	}
	return result;
}
_.readBuffer = function(buffer) {
	if (_.isUtf8(buffer)) {
		buffer = buffer.toString('utf8');
		if (buffer.charCodeAt(0) === 0xFEFF) {
			buffer = buffer.substring(1);
		}

	} else {
		buffer = _.getIconv().decode(buffer, 'gbk');
	}
	return buffer;
}
_.getIconV = function() {
	if (!iconv) {
		iconv = require('iconv-lite');
	}
	return iconv;
}
_.isUtf8 = function(bytes) {
	var i = 0;
	while (i < bytes.length) {
		if (( // ASCII
				0x00 <= bytes[i] && bytes[i] <= 0x7F
			)) {
			i += 1;
			continue;
		}

		if (( // non-overlong 2-byte
				(0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
				(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
			)) {
			i += 2;
			continue;
		}

		if (
			( // excluding overlongs
				bytes[i] == 0xE0 &&
				(0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
				(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
			) || ( // straight 3-byte
				((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
					bytes[i] == 0xEE ||
					bytes[i] == 0xEF) &&
				(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
				(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
			) || ( // excluding surrogates
				bytes[i] == 0xED &&
				(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
				(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
			)
		) {
			i += 3;
			continue;
		}

		if (
			( // planes 1-3
				bytes[i] == 0xF0 &&
				(0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
				(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
				(0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
			) || ( // planes 4-15
				(0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
				(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
				(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
				(0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
			) || ( // plane 16
				bytes[i] == 0xF4 &&
				(0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
				(0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
				(0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
			)
		) {
			i += 4;
			continue;
		}
		return false;
	}
	return true;
}
var class2type = {};
var toString = class2type.toString;

"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name) {
	class2type["[object " + name + "]"] = name.toLowerCase()
});

_.type = function(obj) {

	return obj == null ? String(obj) :
		class2type[toString.call(obj)] || "object"
}
_.isArray = function(obj) {
	return _.type(obj) === 'array';
}

_.isString = function(obj){
	return _.type(obj) === 'string';
}















