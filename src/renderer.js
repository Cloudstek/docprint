'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Renderer = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _lessPluginAutoprefix = require('less-plugin-autoprefix');

var _lessPluginAutoprefix2 = _interopRequireDefault(_lessPluginAutoprefix);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Renderer {
    constructor(templatePath, options = {}) {
        this.options = {};

        this.options = (0, _assign2.default)({}, this.options, options);

        this.templatePath = templatePath;

        this.env = _nunjucks2.default.configure(templatePath, this.options);
    }

    render(file, context = {}) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return new _promise2.default(function (resolve, reject) {
                _this._filterFind();
                _this._filterIncludes();
                _this._filterLess();
                _this._filterHighlightUrl();

                _this.env.render(file, context, function (err, output) {
                    if (err) {
                        reject(err);
                    }

                    resolve(output);
                });
            });
        })();
    }

    _filterFind() {
        this.env.addFilter('find', (obj, property, value) => {
            if (!Array.isArray(obj)) {
                return;
            }

            return obj.find(o => o[property] === value);
        });
    }

    _filterIncludes() {
        this.env.addFilter('includes', (haystack, needle, position = 0) => {
            return haystack.includes(needle, position);
        });
    }

    _filterLess() {
        this.env.addFilter('less', (file, kwargs, cb) => {
            let filePath = _path2.default.resolve(this.templatePath, file);
            let code = _fsExtra2.default.readFileSync(filePath, 'utf8');

            let autoprefixer = new _lessPluginAutoprefix2.default({
                browsers: cb && kwargs && kwargs.browsers || null
            });

            if (!cb) {
                cb = kwargs;
            }

            _less2.default.render(code, {
                paths: [this.templatePath, _path2.default.resolve(this.templatePath, _path2.default.dirname(file))],
                plugins: [autoprefixer]
            }, (err, res) => {
                if (err) {
                    cb(err.toString());
                }

                cb(null, res.css);
            });
        }, true);
    }

    _filterHighlightUrl() {
        this.env.addFilter('highlightUrl', url => {
            return url && url.replace(/({.+?})/g, '<span class="hljs-keyword">$1</span>');
        });
    }
}
exports.Renderer = Renderer;