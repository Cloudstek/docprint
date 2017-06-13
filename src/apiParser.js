'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApiParser = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _hercule = require('hercule');

var _drafter = require('drafter');

var _drafter2 = _interopRequireDefault(_drafter);

var _refractParser = require('./refractParser');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ApiParser {

    constructor(options = {}) {
        this.options = {
            drafter: {},
            hercule: {},
            languages: [{ name: 'curl', displayName: 'cURL', snippet: { target: 'shell', client: 'curl' }, hljs: 'bash' }, { name: 'node', displayName: 'NodeJS', snippet: { target: 'node', client: 'request' }, hljs: 'javascript' }, { name: 'python', displayName: 'Python', snippet: { target: 'python', client: 'python3' }, hljs: 'python' }, { name: 'java', displayName: 'Java', snippet: { target: 'java', client: 'okhttp' }, hljs: 'java' }, { name: 'ruby', displayName: 'Ruby', snippet: { target: 'ruby', client: 'native' }, hljs: 'ruby' }, { name: 'php', displayName: 'PHP', snippet: { target: 'php', client: 'ext-curl' }, hljs: 'php' }, { name: 'go', displayName: 'Go', snippet: { target: 'go', client: 'native' }, hljs: 'go' }]
        };

        this.options = (0, _assign2.default)({}, this.options, options);
    }

    get languages() {
        return this.options.languages || [];
    }

    parseRaw(file) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return _this._transclude(file, _this.options.hercule).then(function (contents) {
                return _this._parseApi(contents, _this.options.drafter);
            });
        })();
    }

    parse(file) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)(function* () {
            return _this2.parseRaw(file).then(function (contents) {
                let apiUrl = _this2._getHost(contents);

                return _this2._parseRefract(contents, {
                    apiUrl: apiUrl,
                    languages: _this2.options.languages
                });
            });
        })();
    }

    _transclude(file, options = {}) {
        return (0, _asyncToGenerator3.default)(function* () {
            return new _promise2.default(function (resolve, reject) {
                (0, _hercule.transcludeFile)(file, options, function (err, output) {
                    if (err) {
                        reject(err);
                    }

                    resolve(output);
                });
            });
        })();
    }

    _parseApi(contents, options = {}) {
        return (0, _asyncToGenerator3.default)(function* () {
            return new _promise2.default(function (resolve, reject) {
                _drafter2.default.parse(contents, options, function (err, output) {
                    if (err) {
                        reject(err);
                    }

                    resolve(output);
                });
            });
        })();
    }

    _parseRefract(doc, options = {}) {
        return (0, _asyncToGenerator3.default)(function* () {
            let parser = new _refractParser.RefractParser(options);

            return parser.parse(doc);
        })();
    }

    _getHost(doc) {
        let metas = doc.content[0].attributes.meta || null;

        if (metas) {
            let hostMeta = metas.find(meta => {
                return meta.content.key.content === 'HOST';
            });

            return hostMeta ? (0, _util.stripSlash)(hostMeta.content.value.content) : null;
        }
    }
}
exports.ApiParser = ApiParser;