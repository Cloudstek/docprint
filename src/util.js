'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitize(input) {
    return input.filter(a => a);
}

function capitalize(str) {
    return str && str.charAt(0).toUpperCase() + str.slice(1);
}

function at(o, path, def) {
    if (!o || !path) {
        return o;
    }

    let pointer = o;
    let failed = false;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(path.split('.')), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            let p = _step.value;

            if (pointer[p] !== null && pointer[p] !== undefined && !failed) {
                pointer = pointer[p];
            } else {
                failed = true;
            }
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

    return failed ? o[path] || def : pointer;
}

function stripSlash(str) {
    if (str && str.endsWith('/')) {
        return str.substr(0, str.length - 1);
    }

    return str;
}

function slugify(str) {
    return str && str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

module.exports = {
    slugify: slugify,
    capitalize: capitalize,
    at: at,
    stripSlash: stripSlash,
    sanitize: sanitize
};