#!/usr/bin/env node
'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let build = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* () {
        return (0, _src2.default)({
            filepath: _commander2.default.input,
            destination: _commander2.default.output,
            header: _commander2.default.header,
            css: _commander2.default.css,
            template: _commander2.default.template
        });
    });

    return function build() {
        return _ref.apply(this, arguments);
    };
})();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _src = require('../src');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.option('-i, --input <file>', 'Path to the blueprint file').option('-o, --output <dir>', 'Destination folder').option('-h, --header <header>', 'Custom nunjucks/HTML header file').option('-c, --css <css>', 'Custom CSS/LESS file').option('-t, --template <file>', 'Custom nunjucks template file or one of the built-in templates').option('-w, --watch', 'Watch for changes').parse(process.argv);

if (!_commander2.default.input || !_commander2.default.output || _commander2.default.output.length === 0 || _commander2.default.input.length === 0) {
    _commander2.default.help();
    process.exit();
}

function watch(bs, files) {
    files = files.filter(a => a);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let file = _step.value;

            bs.watch(file).on('change', () => {
                bs.notify('Rebruilding, please wait!');
                build().then(() => {
                    bs.reload();
                });
            });
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

if (_commander2.default.watch) {
    let bs = _browserSync2.default.create();

    watch(bs, [_commander2.default.input, _commander2.default.css, _commander2.default.header, _commander2.default.template]);

    bs.init({
        server: _commander2.default.output,
        notify: false,
        ui: false
    });
}

build();