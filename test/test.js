
var unit = require('../index.js');
var tap = require('tap');

var isJsFile = unit.isJsFile(__dirname+'/files/a.js'),
	isCssFile = unit.isCssFile(__dirname+'/files/b.css'),
	isExistFile = unit.isExistFile(__dirname+'/files/a.js'),
	isFile = unit.isFile(__dirname+'/files/b.css'),
	isDirectory = unit.isDirectory(__dirname+'/files/');



tap.test('fileType', function(t) {

	t.equal(isJsFile,true);

	t.equal(isCssFile,true);

	t.equal(isExistFile,true);

	t.equal(isFile,true);

	t.equal(isDirectory,true);
	
	t.end();

});

tap.test('fileContent', function(t) {

	var json = unit.readJSON(__dirname+'/files/test.json');

	t.deepEqual(json,{
    "name": "tool-set",
    "version": "0.0.1",
    "description": "private a tool set",
    "main": "index.js",
    "scripts": {
        "test": "node ./test/"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/ybbjegj/toolset.git"
    },
    "keywords": [
        "tool",
        "set"
    ],
    "author": "guomilo@gmail.com",
    "license": "MIT",
    "bugs": {
        "url": "https://github.com/ybbjegj/toolset/issues"
    },
    "homepage": "https://github.com/ybbjegj/toolset#readme",
    "dependencies": {

        "iconv-lite": "^0.4.13",
        "tap": "^2.1.1"
    }
});

	t.end();




});


