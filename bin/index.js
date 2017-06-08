#!/usr/bin/env node
'use strict';

var program = require('commander');

program
	.option('-p, --filepath <filepath>', 'Path to the blueprint file')
	.option('-d, --destination <destination>', 'Destination folder')
	.option('-h, --header <header>', 'path to the HTML file of the header')
	.option('-t, --headerhtml <headerhtml>', 'HTML of header')
	.option('-c, --css <css>', 'CSS file location')
	.parse(process.argv);

if (!program.hasOwnProperty('filepath') || !program.hasOwnProperty('destination') || program.destination.length === 0 || program.filepath.length === 0) {
	console.log("Usage: docprint --filepath <filepath> --destination <destination>");
	process.exit();
}

require('../src')({
	filepath: program.filepath,
	destination: program.destination,
	headerhtml: program.headerhtml,
	header: program.header,
	css: program.css
})
