'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlMinifier = require('html-minifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

var _apiParser = require('./apiParser');

var _renderer = require('./renderer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (options = {}) {
        if (!options.input || options.input.length === 0) {
            throw new Error('No input file given.');
        }

        if (options.css) {
            options.css = _fsExtra2.default.readFileSync(options.css, 'utf8');
        }

        if (options.header) {
            options.header = _fsExtra2.default.readFileSync(options.header, 'utf8');
        }

        options.template = options.template || _path2.default.join(__dirname, 'themes', 'default', 'default.njk');

        if (!options.template.endsWith('.njk')) {
            try {
                options.template = require.resolve('docprint-theme-' + options.template);
            } catch (err) {
                throw new Error('Could not load theme: ' + options.template);
            }
        }

        const parser = new _apiParser.ApiParser({
            drafter: {
                requireBlueprintName: true
            }
        });

        let result = yield parser.parse(options.input);

        const renderer = new _renderer.Renderer(_path2.default.dirname(options.template), {
            trimBlocks: true
        });

        let output = yield renderer.render(_path2.default.basename(options.template), {
            doc: result,
            groups: result.content.content,
            title: result.content.title,
            description: result.content.description,
            customCss: options.css,
            customHeader: options.header,
            dataStructures: result.dataStructures,
            languages: result.languages
        });

        if (options.minify === true) {
            output = _htmlMinifier2.default.minify(output, {
                minifyCSS: true,
                minifyJS: true
            });
        }

        if (/\.\w+$/.test(options.output) === false) {
            options.output = _path2.default.join(options.output, 'index.html');
        }

        _fsExtra2.default.outputFileSync(options.output, output);
    });

    return function () {
        return _ref.apply(this, arguments);
    };
})();