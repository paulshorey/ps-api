'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('./utils');

var _acts = require('./acts');

var _acts2 = _interopRequireDefault(_acts);

var _crawlers = require('./crawlers');

var _crawlers2 = _interopRequireDefault(_crawlers);

var _key_value_stores = require('./key_value_stores');

var _key_value_stores2 = _interopRequireDefault(_key_value_stores);

var _datasets = require('./datasets');

var _datasets2 = _interopRequireDefault(_datasets);

var _logs = require('./logs');

var _logs2 = _interopRequireDefault(_logs);

var _apify_error = require('./apify_error');

var _apify_error2 = _interopRequireDefault(_apify_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apify Client for JavaScript
 */

/** @ignore */
var getDefaultOptions = function getDefaultOptions() {
    return {
        baseUrl: 'https://api.apify.com'
    };
};

/**
 * IMPORTANT:
 *
 * This file MUST contain only one export which is default export of Apify Client.
 * Otherwise it would not get exported under require('apify-client') but ugly
 * require('apify-client').default instead.
 *
 * See: https://github.com/59naga/babel-plugin-add-module-exports
 */

/**
 * Each property is a plain object of methods.
 *
 * Method must have 2 parameters "options" and "requestPromise" where:
 * - requestPromise is utils.requestPromise with Promise parameter set based on
 *   user's choice of Promises dependency.
 * - options
 *
 * Method must return promise.
 * @ignore
 */
var methodGroups = {
    acts: _acts2.default,
    crawlers: _crawlers2.default,
    keyValueStores: _key_value_stores2.default,
    datasets: _datasets2.default,
    logs: _logs2.default
};

/**
 * Creates ApifyClient
 * @class ApifyClient
 * @param {Object} [options] - Global options for ApifyClient. You can globally configure here any method option from any namespace. For example
 *                             if you are working with just one crawler then you can preset it's crawlerId here instead of passing it to each
 *                             crawler's method.
 * @param {String} [options.userId] - Your user ID at apify.com
 * @param {String} [options.token] - Your API token at apify.com
 * @param {Object} [options.promise=Promise] - Promises dependency to use (default is native Promise)
 * @param {Number} [options.expBackOffMillis=500] - Wait time in milliseconds before repeating request to Apify API in a case of server
                                                    or rate limit error
 * @param {Number} [options.expBackOffMaxRepeats=8] - Maximum number of repeats in a case of error
 * @description Basic usage of ApifyClient with Bluebird promise:
 * ```javascript
 * const ApifyClient = require('apify-client');
 * const Promise = require("bluebird");;
 *
 * const apifyClient = new ApifyClient({
 *   userId: 'jklnDMNKLekk',
 *   token: 'SNjkeiuoeD443lpod68dk',
 *   promise: Promise,
 * });
 * ```
 */
var ApifyClient = function ApifyClient() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // This allows to initiate ApifyClient both ways - with and without "new".
    if (!this || this.constructor !== ApifyClient) return new ApifyClient(options);

    // This is used only internally for unit testing of ApifyClient.
    var undecoratedMethodGroups = options._overrideMethodGroups || methodGroups;
    delete options._overrideMethodGroups;

    var instanceOpts = Object.assign({}, getDefaultOptions(), options);

    // Choose Promises dependency and throw if no one is set.
    if (!instanceOpts.promise) {
        if (typeof Promise === 'function') {
            instanceOpts.promise = Promise;
        } else {
            throw new _apify_error2.default(_apify_error.INVALID_PARAMETER_ERROR_TYPE_V2, 'The "options.promise" parameter is required when native Promise is not available');
        }
    }

    /**
     * This decorator does:
     * - extends "options" parameter with values from default options and from ApifyClient instance options
     * - adds options.baseUrl
     * - passes preconfigured utils.requestPromise with Promises dependency set
     * - allows to use method with both callbacks and promises
     * @ignore
     */
    var methodDecorator = function methodDecorator(method) {
        return function (callOpts, callback) {
            var mergedOpts = Object.assign({}, instanceOpts, callOpts);

            // Check that all required parameters are set.
            if (!instanceOpts.baseUrl) throw new _apify_error2.default(_apify_error.INVALID_PARAMETER_ERROR_TYPE_V2, 'The "options.baseUrl" parameter is required');

            // Remove traling forward slash from baseUrl.
            if (mergedOpts.baseUrl.substr(-1) === '/') mergedOpts.baseUrl = mergedOpts.baseUrl.slice(0, -1);

            var preconfiguredRequestPromise = function preconfiguredRequestPromise(requestPromiseOptions) {
                return (0, _utils.requestPromise)(Object.assign({}, _underscore2.default.pick(mergedOpts, _utils.REQUEST_PROMISE_OPTIONS), requestPromiseOptions));
            };

            var promise = method(preconfiguredRequestPromise, mergedOpts);

            if (!callback) return promise;

            promise.then(function (result) {
                return callback(null, result);
            }, function (error) {
                return callback(error);
            });
        };
    };

    // Decorate methods and bind them to this object.
    _underscore2.default.forEach(undecoratedMethodGroups, function (methodGroup, name) {
        _this[name] = _underscore2.default.mapObject(methodGroup, methodDecorator);
    });
    /**
     * Overrides options of ApifyClient instance.
     * @memberof ApifyClient
     * @function setOptions
     * @instance
     * @param {Object} options - See {@link ApifyClient} options object for ApifyClient
     */
    this.setOptions = function (newOptions) {
        _underscore2.default.forEach(newOptions, function (val, key) {
            instanceOpts[key] = val;
        });
    };
    /**
     * Returns options of ApifyClient instance.
     * @memberof ApifyClient
     * @function getOptions
     * @instance
     * @return {Object} See {@link ApifyClient} constructor options
     */
    this.getOptions = function () {
        return _underscore2.default.clone(instanceOpts);
    };

    /**
     * This helper function is used in unit tests.
     * @ignore
     */
    this.getDefaultOptions = getDefaultOptions;
};

exports.default = ApifyClient;
module.exports = exports['default'];