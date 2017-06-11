#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _src = require('../src');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-p, --filepath <filepath>', 'Path to the blueprint file').option('-d, --destination <destination>', 'Destination folder').option('-h, --header <header>', 'Custom nunjucks/HTML header file or contents').option('-c, --css <css>', 'Custom CSS file or contents').option('-t, --template <file>', 'Custom nunjucks template file or one of the built-in templates').parse(process.argv);

if (!_commander2.default.filepath || !_commander2.default.destination || _commander2.default.destination.length === 0 || _commander2.default.filepath.length === 0) {
    _commander2.default.help();
    process.exit();
}

(0, _src2.default)({
    filepath: _commander2.default.filepath,
    destination: _commander2.default.destination,
    header: _commander2.default.header,
    css: _commander2.default.css,
    template: _commander2.default.template
});