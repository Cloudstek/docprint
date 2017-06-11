'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _promisifyEs = require('promisify-es6');

var _promisifyEs2 = _interopRequireDefault(_promisifyEs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _drafter2 = require('drafter');

var _drafter3 = _interopRequireDefault(_drafter2);

var _hercule = require('hercule');

var _parser = require('./parser');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* (options = {}) {
        if (!options.filepath || options.filepath.length === 0) {
            throw new Error('No input file given.');
        }

        let customCss;
        let customHeader;
        let template = options.template || _path2.default.join(__dirname, 'templates', 'default', 'default.njk');

        let css = yield _fsExtra2.default.readFile(_path2.default.join(__dirname, 'css', 'style.css'), 'utf8');

        const transcludeFile = (0, _promisifyEs2.default)(_hercule.transcludeFile);
        const drafterParse = (0, _promisifyEs2.default)(_drafter3.default.parse);

        if (options.css) {
            if (options.css.endsWith('.css')) {
                customCss = _fsExtra2.default.readFileSync(options.css, 'utf8');
            } else {
                customCss = options.css;
            }
        }

        if (options.header) {
            if (options.header.endsWith('.html') || options.header.endsWith('.htm')) {
                customHeader = _fsExtra2.default.readFileSync(options.header, 'utf8');
            } else {
                customHeader = options.header;
            }
        }

        let result;
        result = yield transcludeFile(options.filepath);
        result = yield drafterParse(result, {
            requireBlueprintName: true
        });

        let parser = new _parser.RefractParser({
            apiUrl: getHost(result)
        });

        let output = yield parser.parse(result);

        let dataStructures = parser.getDataStructures(output);

        let env = _nunjucks2.default.configure(_path2.default.join(__dirname, 'templates', 'default'), {
            noCache: true
        });

        env.addFilter('find', function (obj, property, value) {
            if (!Array.isArray(obj)) {
                return;
            }
            return obj.find(function (o) {
                return o[property] === value;
            });
        });

        env.addFilter('includes', function (haystack, needle, position = 0) {
            return haystack.includes(needle, position);
        });

        let res = yield new _promise2.default(function (resolve, reject) {
            env.render('default.njk', {
                doc: output,
                css: css,
                dataStructures: dataStructures,
                languages: parser.getLanguages()
            }, function (err, res) {
                if (err) {
                    console.error(err);
                    process.exit();
                }

                resolve(res);
            });
        });

        _fsExtra2.default.ensureDirSync(options.destination);
        _fsExtra2.default.writeFileSync(_path2.default.join(options.destination, 'index.html'), res);
    });

    return function () {
        return _ref.apply(this, arguments);
    };
})();

function getHost(doc) {
    let metas = (0, _util.at)(doc, 'content.0.attributes.meta');
    if (metas && metas.find) {
        let hostMeta = metas.find(meta => {
            return (0, _util.at)(meta, 'content.key.content') === 'HOST';
        });

        return hostMeta ? (0, _util.stripSlash)((0, _util.at)(hostMeta, 'content.value.content')) : null;
    }
}