'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RefractParser = undefined;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _httpsnippet = require('httpsnippet');

var _httpsnippet2 = _interopRequireDefault(_httpsnippet);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RefractParser {

    constructor(options = {}) {
        this.languages = [{ name: 'curl', displayName: 'cURL', snippet: { target: 'shell', client: 'curl' }, hljs: 'bash' }, { name: 'node', displayName: 'NodeJS', snippet: { target: 'node', client: 'request' }, hljs: 'javascript' }, { name: 'python', displayName: 'Python', snippet: { target: 'python', client: 'python3' }, hljs: 'python' }, { name: 'java', displayName: 'Java', snippet: { target: 'java', client: 'okhttp' }, hljs: 'java' }, { name: 'ruby', displayName: 'Ruby', snippet: { target: 'ruby', client: 'native' }, hljs: 'ruby' }, { name: 'php', displayName: 'PHP', snippet: { target: 'php', client: 'ext-curl' }, hljs: 'php' }, { name: 'go', displayName: 'Go', snippet: { target: 'go', client: 'native' }, hljs: 'go' }];

        this.options = (0, _assign2.default)({}, this.options, options);

        this.markdownIt = (0, _markdownIt2.default)({
            html: true,
            linkify: true,
            typographer: true
        });

        this.markdownIt.use(require('markdown-it-anchor'), {
            permalink: true
        });
    }

    parse(doc) {
        if (!doc.element && !doc.element === 'parseResult') {
            throw new Error('Input is not a valid refract object.');
        }

        return {
            type: 'result',
            content: doc.content && doc.content.length > 0 && this._parse(doc.content[0], {}, { type: 'result' }).current
        };
    }

    getDataStructures(doc) {
        if (!doc.type && !doc.type === 'result') {
            throw new Error('Input is not a valid RefractParser result object.');
        }

        let ds = (0, _util.at)(doc, 'content.0.content');

        ds = ds && ds.find(el => el.type === 'dataStructures');
        return ds && ds.content || [];
    }

    getLanguages() {
        return this.languages;
    }

    _parse(doc, current = {}, parent = {}) {
        try {
            switch (doc.element) {
                case 'copy':
                    var _parseCopy = this._parseCopy(doc, current, parent);

                    doc = _parseCopy.doc;
                    current = _parseCopy.current;
                    parent = _parseCopy.parent;

                    break;
                case 'category':
                    var _parseCategory = this._parseCategory(doc, current, parent);

                    doc = _parseCategory.doc;
                    current = _parseCategory.current;
                    parent = _parseCategory.parent;

                    break;
                case 'resource':
                    var _parseResource = this._parseResource(doc, current, parent);

                    doc = _parseResource.doc;
                    current = _parseResource.current;
                    parent = _parseResource.parent;

                    break;
                case 'transition':
                    var _parseTransition = this._parseTransition(doc, current, parent);

                    doc = _parseTransition.doc;
                    current = _parseTransition.current;
                    parent = _parseTransition.parent;

                    break;
                case 'dataStructure':
                    var _parseDataStructure = this._parseDataStructure(doc, current, parent);

                    doc = _parseDataStructure.doc;
                    current = _parseDataStructure.current;
                    parent = _parseDataStructure.parent;

                    break;
                case 'httpTransaction':
                    var _parseHttpTransaction = this._parseHttpTransaction(doc, current, parent);

                    doc = _parseHttpTransaction.doc;
                    current = _parseHttpTransaction.current;
                    parent = _parseHttpTransaction.parent;

                    break;
                case 'httpRequest':
                    var _parseHttpRequest = this._parseHttpRequest(doc, current, parent);

                    doc = _parseHttpRequest.doc;
                    current = _parseHttpRequest.current;
                    parent = _parseHttpRequest.parent;

                    break;
                case 'httpResponse':
                    var _parseHttpResponse = this._parseHttpResponse(doc, current, parent);

                    doc = _parseHttpResponse.doc;
                    current = _parseHttpResponse.current;
                    parent = _parseHttpResponse.parent;

                    break;
                case 'asset':
                    var _parseAsset = this._parseAsset(doc, current, parent);

                    doc = _parseAsset.doc;
                    current = _parseAsset.current;
                    parent = _parseAsset.parent;

                    break;
                default:
                    break;
            }
        } catch (err) {
            console.error(err);
        }

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseCopy(doc, current, parent) {
        let description = this.markdownIt.render(doc.content);
        let $ = _cheerio2.default.load(description);

        parent.description = {
            text: description,
            links: $('.header-anchor').map((index, el) => {
                return $(el).attr('href');
            }).toArray()
        };

        return {
            doc: doc,
            current: undefined,
            parent: parent
        };
    }

    _parseCategory(doc, current, parent) {
        let meta = this._getMeta(doc.meta);
        current.type = meta.class;

        if (current.type === 'dataStructures') {
            current.title = meta.title;
            current.content = doc.content.map(ds => {
                let content = ds.content && ds.content[0];
                return {
                    id: content.meta && content.meta.id,
                    content: content
                };
            });
        } else {
            current.id = 'group-' + (0, _util.slugify)(meta.title || parent.title);
            current.title = meta.title;
            current.content = (0, _util.sanitize)(doc.content.map(content => {
                return this._parse(content, {}, current).current;
            }));
        }

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseResource(doc, current, parent) {
        let meta = this._getMeta(doc.meta);

        current.type = 'resource';
        current.title = meta.title;
        current.id = 'resource-' + (0, _util.slugify)(meta.title);
        current.props = this._getProps(doc.attributes);
        current.content = (0, _util.sanitize)(doc.content.map(content => {
            return this._parse(content, {}, current).current;
        }));

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseTransition(doc, current, parent) {
        let meta = this._getMeta(doc.meta);

        current.type = 'transition';
        current.title = meta.title;
        current.props = this._getProps(doc.attributes);
        current.transaction = doc.content.find(el => {
            return el && el.element && el.element === 'httpTransaction';
        }) || null;

        current.transaction = current.transaction && this._parse(current.transaction, {}, current).current;

        let method = current.transaction && current.transaction.request.props.method;
        if (method) {
            method = '-' + method;
        }

        current.id = 'transition-' + (0, _util.slugify)(meta.title + method);
        current.xhrContent = this._xhrContent(current, parent);
        current.snippets = {};

        if (current.xhrContent) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.languages), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    let lang = _step.value;

                    current.snippets[lang.name] = unescape(new _httpsnippet2.default(current.xhrContent).convert(lang.snippet.target, lang.snippet.type));
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

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseDataStructure(doc, current, parent) {
        current.type = 'dataStructure';
        current.content = doc.content;

        let trId = (0, _util.capitalize)(current.content[0] && current.content[0].meta && current.content[0].meta.id);

        if (trId) {
            current.id = 'object-' + (0, _util.slugify)(trId);
            current.title = trId + ' Object';
        }

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseHttpTransaction(doc, current, parent) {
        let meta = this._getMeta(doc.meta);

        current.type = 'httpTransaction';
        current.title = meta.title;
        current.props = {};

        current.request = doc.content.find(el => {
            return el.element && el.element === 'httpRequest';
        }) || null;

        current.request = current.request && this._parse(current.request, {}, current).current;

        current.responses = doc.content.filter(el => {
            return el && el.element && el.element === 'httpResponse';
        }) || [];

        current.responses = current.responses.map(response => {
            return this._parse(response, {}, current).current;
        });

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseHttpRequest(doc, current, parent) {
        let meta = this._getMeta(doc.meta);

        current.type = 'httpRequest';
        current.title = meta.title;
        current.props = this._getProps(doc.attributes);

        let content = (0, _util.sanitize)(doc.content.map(content => {
            return this._parse(content, {}, current).current;
        }));

        current.body = content.find(el => {
            return el.type && el.type === 'body';
        });

        current.body = current.body && current.body.content;

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseHttpResponse(doc, current, parent) {
        let meta = this._getMeta(doc.meta);

        current.type = 'httpResponse';
        current.title = meta.title;
        current.props = this._getProps(doc.attributes);

        let content = (0, _util.sanitize)(doc.content.map(content => {
            return this._parse(content, {}, current).current;
        }));

        current.body = content.find(el => {
            return el.type && el.type === 'body';
        });

        current.body = current.body && current.body.content;

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _parseAsset(doc, current, parent) {
        let meta = this._getMeta(doc.meta);

        if (meta.class === 'messageBody') {
            current.type = 'body';
            current.title = meta.title;
            current.content = doc.content;
        }

        return {
            doc: doc,
            current: current,
            parent: parent
        };
    }

    _getMeta(meta = {}) {
        let classes = '';

        if (meta.classes && Array.isArray(meta.classes) && meta.classes.length > 0) {
            classes = meta.classes[0];
        }

        return {
            class: classes,
            title: meta.title
        };
    }

    _getProps(props = {}) {
        let urlParameters = [];
        let headers = [];
        let data = '';

        if (props.hrefVariables && props.hrefVariables.content) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(props.hrefVariables.content), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    let variable = _step2.value;

                    urlParameters.push({
                        wfn: variable.meta && variable.meta.description,
                        key: variable.content && variable.content.key,
                        value: variable.content && variable.content.value
                    });
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        if (props.headers && props.headers.content) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(props.headers.content), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    let variable = _step3.value;

                    headers.push({
                        key: variable.content && variable.content.key,
                        value: variable.content && variable.content.value
                    });
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        if (props.data && props.data.element === 'dataStructure') {
            data = props.data.content;
        }

        return {
            url: props.href,
            method: props.method,
            data: data,
            headers: headers,
            statusCode: props.statusCode,
            urlParameters: urlParameters
        };
    }

    _xhrContent(transition, resource) {
        let httpRequest = transition.transaction.request;

        let requestProps = httpRequest && httpRequest.props;
        requestProps = requestProps || {};

        let transProps = transition.props || {};

        let urlParameters = (0, _assign2.default)(transProps.urlParameters, requestProps.urlParameters);

        let postData = httpRequest.content && httpRequest.content.find(c => c.type === 'body');

        let mimeType = requestProps.headers.find(c => c.type === 'Content-Type') || 'application/json';

        let url = requestProps.url || transProps.url;
        let queryStrings = [];

        if (!url && resource.type === 'resource') {
            url = resource.props && resource.props.url;
            if (resource.props.urlParameters) {
                urlParameters = (0, _assign2.default)(resource.props.urlParameters, urlParameters);
            }
        }

        let hrefSplits = url && url.split('{?') || [];
        if (hrefSplits.length > 1) {
            url = hrefSplits[0];
            let qs = hrefSplits[1].replace('}', '').split(',');

            queryStrings = qs.map(qs => ({
                name: qs.trim(),
                value: '{' + qs.trim() + '}'
            }));
        }

        let originalUrl = url;

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = (0, _getIterator3.default)(urlParameters), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                let param = _step4.value;

                let key = param.key && param.key.content;
                let value = param.value && param.value.content;

                if (!key || !value) {
                    continue;
                }

                let replaceRegex = new RegExp('{' + key + '}', 'g');
                url = url.replace(replaceRegex, value);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        return {
            method: requestProps.method,
            url: this.options.apiUrl + url,
            originalUrl: this.options.apiUrl + originalUrl,
            httpVersion: 'unknown',
            queryString: queryStrings,
            headers: requestProps.headers.map(header => ({
                name: header.key && header.key.content,
                value: header.value && header.value.content
            })),
            attributes: (0, _assign2.default)(transProps.data, requestProps.data),
            urlParameters: urlParameters,
            postData: {
                mimeType: mimeType,
                postData: postData && postData.content
            },
            headersSize: -1,
            bodySize: -1,
            comment: ''
        };
    }
}
exports.RefractParser = RefractParser;