'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sanitize = sanitize;
exports.capitalize = capitalize;
exports.stripSlash = stripSlash;
exports.slugify = slugify;
function sanitize(input) {
    return input.filter(a => a);
}

function capitalize(str) {
    return str && str.charAt(0).toUpperCase() + str.slice(1);
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