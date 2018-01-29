'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseBody = exports.gzipPromise = exports.catchNotFoundOrThrow = exports.pluckData = exports.checkParamOrThrow = exports.requestPromise = exports.newApifyErrorFromResponse = exports.safeJsonParse = exports.REQUEST_PROMISE_OPTIONS = undefined;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _contentType = require('content-type');

var _contentType2 = _interopRequireDefault(_contentType);

var _typeCheck = require('type-check');

var _zlib = require('zlib');

var _apify_error = require('./apify_error');

var _apify_error2 = _interopRequireDefault(_apify_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RATE_LIMIT_EXCEEDED_STATUS_CODE = 429;
var EXP_BACKOFF_MILLIS = 500;
var EXP_BACKOFF_MAX_REPEATS = 8; // 64s
var CONTENT_TYPE_JSON = 'application/json';
var CONTENT_TYPE_TEXT_PLAIN = 'text/plain';

var REQUEST_PROMISE_OPTIONS = exports.REQUEST_PROMISE_OPTIONS = ['promise', 'expBackOffMillis', 'expBackOffMaxRepeats'];

/**
 * Parses a JSON string. If string is not JSON then catches an error and returns empty object.
 */
var safeJsonParse = exports.safeJsonParse = function safeJsonParse(str) {
    var parsed = void 0;

    try {
        parsed = JSON.parse(str);
    } catch (err) {
        parsed = {};
    }

    return parsed;
};

/**
 * Creates an error from API response body and statusCode.
 * If body is object or JSON string in form
 *
 * { type: 'ITEM_NOT_FOUND', message: 'Requested item was not found.' }
 *
 * then uses it's error type or message or both.
 */
var newApifyErrorFromResponse = exports.newApifyErrorFromResponse = function newApifyErrorFromResponse(statusCode, body, isApiV1) {
    var REQUEST_FAILED_ERROR_TYPE = isApiV1 ? _apify_error.REQUEST_FAILED_ERROR_TYPE_V1 : _apify_error.REQUEST_FAILED_ERROR_TYPE_V2;
    var parsedBody = {};

    if (_underscore2.default.isObject(body)) parsedBody = body;else if (_underscore2.default.isString(body)) parsedBody = safeJsonParse(body);

    var error = parsedBody.error || parsedBody;
    var type = error.type || REQUEST_FAILED_ERROR_TYPE;
    var message = error.message || _apify_error.REQUEST_FAILED_ERROR_MESSAGE;

    return new _apify_error2.default(type, message, { statusCode: statusCode });
};

/**
 * Promised version of request(options) function.
 *
 * If response status code is >= 500 or RATE_LIMIT_EXCEEDED_STATUS_CODE then uses exponential backoff
 * alghorithm to repeat the request.
 *
 * Possible options parameters are:
 * - everything supported by 'request' npm package (mainly 'method', 'url' and 'qs')
 * - resolveWithResponse - to resolve promise with whole response instead of just body
 * - expBackOffMillis - initial wait time before next repeat in a case of error
 * - expBackOffMaxRepeats - maximal number of repeats
 */
var requestPromise = exports.requestPromise = function requestPromise(options) {
    var iteration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var isApiV1 = options.isApiV1;

    var INVALID_PARAMETER_ERROR_TYPE = isApiV1 ? _apify_error.INVALID_PARAMETER_ERROR_TYPE_V1 : _apify_error.INVALID_PARAMETER_ERROR_TYPE_V2;
    var REQUEST_FAILED_ERROR_TYPE = isApiV1 ? _apify_error.REQUEST_FAILED_ERROR_TYPE_V1 : _apify_error.REQUEST_FAILED_ERROR_TYPE_V2;

    var PromisesDependency = options.promise;
    var expBackOffMillis = options.expBackOffMillis || EXP_BACKOFF_MILLIS;
    var expBackOffMaxRepeats = options.expBackOffMaxRepeats || EXP_BACKOFF_MAX_REPEATS;
    var method = _underscore2.default.isString(options.method) ? options.method.toLowerCase() : options.method;
    var resolveWithResponse = options.resolveWithResponse;

    if (typeof PromisesDependency !== 'function') {
        throw new _apify_error2.default(INVALID_PARAMETER_ERROR_TYPE, '"options.promise" parameter must be provided');
    }

    if (!method) {
        throw new _apify_error2.default(INVALID_PARAMETER_ERROR_TYPE, '"options.method" parameter must be provided');
    }

    if (!_request2.default[method]) {
        throw new _apify_error2.default(INVALID_PARAMETER_ERROR_TYPE, '"options.method" is not a valid http request method');
    }

    return new PromisesDependency(function (resolve, reject) {
        // We have to use request[method]({ ... }) instead of request({ method, ... })
        // to be able to mock request when unit testing requestPromise().
        _request2.default[method](options, function (error, response, body) {
            var statusCode = response ? response.statusCode : null;

            // If status code is >= 500 or RATE_LIMIT_EXCEEDED_STATUS_CODE then we repeat the request.
            // We use exponential backoff alghorithm with up to `expBackOffMillis` repeats.
            if (error || statusCode >= 500 || statusCode === RATE_LIMIT_EXCEEDED_STATUS_CODE) {
                if (iteration >= expBackOffMaxRepeats) {
                    var errMessage = 'Server request failed with ' + (iteration + 1) + ' tries.';

                    return reject(new _apify_error2.default(REQUEST_FAILED_ERROR_TYPE, errMessage, { statusCode: statusCode, iteration: iteration, error: error }));
                }

                var waitMillis = _underscore2.default.random(expBackOffMillis, expBackOffMillis * 2);
                var repeatCall = function repeatCall() {
                    var nextCallOptions = Object.assign({}, options, { expBackOffMillis: expBackOffMillis * 2 });

                    requestPromise(nextCallOptions, iteration + 1).then(resolve, reject);
                };

                return setTimeout(repeatCall, waitMillis);
            }

            // For status codes 300-499 except RATE_LIMIT_EXCEEDED_STATUS_CODE we immediately rejects the promise
            // since it's probably caused by invalid url (redirect 3xx) or invalid user input (4xx).
            if (statusCode >= 300) return reject(newApifyErrorFromResponse(statusCode, body, isApiV1));

            if (resolveWithResponse) resolve(response);else resolve(body);
        });
    });
};

/**
 * Checks that given parameter is of given type and throws ApifyError.
 * If errorMessage is not provided then error message is created from name and type of param.
 *
 * @param {String} value - user entered value of that parameter
 * @param {String} name - parameter name (crawlerId for options.crawlerId)
 * @param {String} type - "String", "Number", ... (see ee: https://github.com/gkz/type-check)
 * @param {String} errorMessage - optional error message
 */
var checkParamOrThrow = exports.checkParamOrThrow = function checkParamOrThrow(value, name, type, errorMessage, isApiV1) {
    var INVALID_PARAMETER_ERROR_TYPE = isApiV1 ? _apify_error.INVALID_PARAMETER_ERROR_TYPE_V1 : _apify_error.INVALID_PARAMETER_ERROR_TYPE_V2;

    if (!errorMessage) errorMessage = 'Parameter "' + name + '" of type ' + type + ' must be provided';

    var allowedTypes = (0, _typeCheck.parseType)(type);

    // This is workaround since Buffer doesn't seem to be possible to define using options.customTypes.
    var allowsBuffer = allowedTypes.filter(function (item) {
        return item.type === 'Buffer';
    }).length;

    if (allowsBuffer && Buffer.isBuffer(value)) return;

    // This will ignore Buffer type.
    if (!(0, _typeCheck.parsedTypeCheck)(allowedTypes, value)) {
        throw new _apify_error2.default(INVALID_PARAMETER_ERROR_TYPE, errorMessage);
    }
};

/**
 * Returns object's data property or null if parameter is not an object.
 */
var pluckData = exports.pluckData = function pluckData(obj) {
    return _underscore2.default.isObject(obj) && !_underscore2.default.isUndefined(obj.data) ? obj.data : null;
};

/**
 * If given HTTP error has NOT_FOUND_STATUS_CODE status code then returns null.
 * Otherwise rethrows error.
 */
var catchNotFoundOrThrow = exports.catchNotFoundOrThrow = function catchNotFoundOrThrow(err) {
    if (err.details && err.details.statusCode === _apify_error.NOT_FOUND_STATUS_CODE) return null;

    throw err;
};

/**
 * Promisified zlib.gzip().
 */
var gzipPromise = exports.gzipPromise = function gzipPromise(Promise, buffer) {
    return new Promise(function (resolve, reject) {
        (0, _zlib.gzip)(buffer, function (err, gzippedBuffer) {
            if (err) return reject(err);

            resolve(gzippedBuffer);
        });
    });
};

/**
 * Function for parsing key-value store record's body.
 */
var parseBody = exports.parseBody = function parseBody(body, contentType) {
    var type = _contentType2.default.parse(contentType).type;

    switch (type) {
        case CONTENT_TYPE_JSON:
            return JSON.parse(body);
        case CONTENT_TYPE_TEXT_PLAIN:
            return body.toString();
        default:
            return body;
    }
};