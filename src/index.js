'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let renderTemplate = (() => {
    var _ref2 = (0, _asyncToGenerator3.default)(function* (env, template, context) {
        return new _promise2.default(function (resolve, reject) {
            env.render(template, context, function (err, res) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(res);
            });
        });
    });

    return function renderTemplate(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
    };
})();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _promisifyEs = require('promisify-es6');

var _promisifyEs2 = _interopRequireDefault(_promisifyEs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

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
        options.template = options.template || _path2.default.join(__dirname, 'templates', 'default', 'default.njk');

        const transcludeFile = (0, _promisifyEs2.default)(_hercule.transcludeFile);
        const drafter = (0, _promisifyEs2.default)(_drafter3.default);

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
        result = yield drafter.parse(result, {
            requireBlueprintName: true
        });

        let parser = new _parser.RefractParser({
            apiUrl: getHost(result)
        });

        let output = yield parser.parse(result);

        console.log((0, _stringify2.default)(output, null, '\t'));

        let dataStructures = parser.getDataStructures(output);

        let env = _nunjucks2.default.configure(_path2.default.dirname(options.template));

        env = addFilters(env, options);

        let res = yield renderTemplate(env, _path2.default.basename(options.template), {
            doc: output,
            groups: output.content.content,
            title: output.content.title,
            description: output.content.description,
            css: customCss,
            header: customHeader,
            dataStructures: dataStructures,
            languages: parser.getLanguages()
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

function addFilters(env, options) {
    env.addFilter('find', (obj, property, value) => {
        if (!Array.isArray(obj)) {
            return;
        }

        return obj.find(o => o[property] === value);
    });

    env.addFilter('includes', (haystack, needle, position = 0) => {
        return haystack.includes(needle, position);
    });

    env.addFilter('less', (code, cb) => {
        let paths = ['.'];

        if (code.endsWith('.less')) {
            let filePath = _path2.default.resolve(_path2.default.dirname(options.template), code);
            code = _fsExtra2.default.readFileSync(filePath, 'utf8');
            paths.push(_path2.default.dirname(filePath));
        }

        _less2.default.render(code, {
            paths: paths
        }, (err, res) => {
            if (err) {
                cb(err.toString());
            }

            cb(null, res.css);
        });
    }, true);

    env.addFilter('highlightUrl', url => {
        return url && url.replace(/({.+?})/g, '<span class="hljs-keyword">$1</span>');
    });

    return env;
}