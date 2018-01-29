'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SIGNED_URL_UPLOAD_MIN_BYTESIZE = exports.BASE_PATH = undefined;

var _utils = require('./utils');

/**
 * Key-value Stores
 * @memberOf ApifyClient
 * @description
 * ### Basic usage
 * ```javascript
 * const ApifyClient = require('apify-client');
 *
 * const apifyClient = new ApifyClient({
 *        userId: 'RWnGtczasdwP63Mak',
 *        token: 'f5J7XsdaKDyRywwuGGo9',
 * });
 * const keyValueStores = apifyClient.keyValueStores;
 *
 * const store = await keyValueStores.getOrCreateStore({ storeName: 'my-store' });
 * apifyClient.setOptions({ storeId: store.id });
 * await keyValueStores.putRecord({
 *      key: 'foo',
 *      body: 'bar',
 *      contentType: 'text/plain; charset=utf-8',
 * });
 * const record = await keyValueStores.getRecord({ key: 'foo' });
 * const keys = await keyValueStores.getRecordsKeys();
 * await keyValueStores.deleteRecord({ key: 'foo' });
 * ```
 *
 * Every method can be used as either promise or with callback. If your Node version supports await/async then you can await promise result.
 * ```javascript
 * // Awaited promise
 * try {
 *      const record = await keyValueStores.getRecord({ key: 'foo' });
 *      // Do something record ...
 * } catch (err) {
 *      // Do something with error ...
 * }
 *
 * // Promise
 * keyValueStores.getRecord({ key: 'foo' })
 * .then((RECORD) => {
 *      // Do something record ...
 * })
 * .catch((err) => {
 *      // Do something with error ...
 * });
 *
 * // Callback
 * keyValueStores.getRecord({ key: 'foo' }, (err, record) => {
 *      // Do something with error or record ...
 * });
 * ```
 * @namespace keyValueStores
 */

var BASE_PATH = exports.BASE_PATH = '/v2/key-value-stores';
var SIGNED_URL_UPLOAD_MIN_BYTESIZE = exports.SIGNED_URL_UPLOAD_MIN_BYTESIZE = 1024 * 256;

exports.default = {
    /**
     * Creates store of given name and returns it's object. If store with given name already exists then returns it's object.
     *
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.storeName - Custom unique name to easily identify the store in the future.
     * @param callback
     * @returns {KeyValueStore}
     */
    getOrCreateStore: function getOrCreateStore(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            storeName = options.storeName;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(storeName, 'storeName', 'String');

        return requestPromise({
            url: '' + baseUrl + BASE_PATH,
            json: true,
            method: 'POST',
            qs: { name: storeName, token: token }
        }).then(_utils.pluckData);
    },

    /**
     * Gets list of key-value stores.
     * @descriptions By default, the objects are sorted by the createdAt field in ascending order,
     * therefore you can use pagination to incrementally fetch all stores while new ones are still being created.
     * To sort them in descending order, use desc: 1 parameter.
     * The endpoint supports pagination using limit and offset parameters and it will not return more than 1000 array elements.
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {Number} [options.offset=0] - Number of array elements that should be skipped at the start.
     * @param {Number} [options.limit=1000] - Maximum number of array elements to return.
     * @param {Number} [options.desc] - If 1 then the objects are sorted by the startedAt field in descending order.
     * @param callback
     * @returns {PaginationList}
     */
    listStores: function listStores(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            offset = options.offset,
            limit = options.limit,
            desc = options.desc,
            unnamed = options.unnamed;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(limit, 'limit', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(offset, 'offset', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(desc, 'desc', 'Maybe Boolean');
        (0, _utils.checkParamOrThrow)(unnamed, 'unnamed', 'Maybe Boolean');

        var query = { token: token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;
        if (desc) query.desc = 1;
        if (unnamed) query.unnamed = 1;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH,
            json: true,
            method: 'GET',
            qs: query
        }).then(_utils.pluckData);
    },

    /**
     * Gets key-value store.
     *
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param {String} options.storeId - Unique store Id
     * @param callback
     * @returns {KeyValueStore}
     */
    getStore: function getStore(requestPromise, options) {
        var baseUrl = options.baseUrl,
            storeId = options.storeId;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(storeId, 'storeId', 'String');

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + storeId,
            json: true,
            method: 'GET'
        }).then(_utils.pluckData).catch(_utils.catchNotFoundOrThrow);
    },

    /**
     * Deletes key-value store.
     *
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param {String} options.storeId - Store Id
     * @param callback
     * @returns {*}
     */
    deleteStore: function deleteStore(requestPromise, options) {
        var baseUrl = options.baseUrl,
            storeId = options.storeId;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(storeId, 'storeId', 'String');

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + storeId,
            json: true,
            method: 'DELETE'
        });
    },

    /**
     * Gets value stored in the key-value store under the given key.
     *
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param {String} options.storeId - Unique store Id
     * @param {String} options.key - Key of the record
     * @param {Boolean} [options.disableBodyParser] - It true, it doesn't parse record's body based on content type.
     * @param {Boolean} [options.disableRedirect] - API by default redirects user to signed record url for faster download.
                                                    If disableRedirect=1 is set then API returns the record value directly.
     * @param callback
     * @returns {KeyValueStoreRecord}
     */
    getRecord: function getRecord(requestPromise, options) {
        var baseUrl = options.baseUrl,
            storeId = options.storeId,
            key = options.key,
            disableBodyParser = options.disableBodyParser,
            disableRedirect = options.disableRedirect;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(storeId, 'storeId', 'String');
        (0, _utils.checkParamOrThrow)(key, 'key', 'String');
        (0, _utils.checkParamOrThrow)(disableBodyParser, 'disableBodyParser', 'Maybe Boolean');
        (0, _utils.checkParamOrThrow)(disableRedirect, 'disableRedirect', 'Maybe Boolean');

        var requestOpts = {
            url: '' + baseUrl + BASE_PATH + '/' + storeId + '/records/' + key,
            method: 'GET',
            json: false,
            qs: {},
            gzip: true,
            resolveWithResponse: true,
            encoding: null
        };

        if (disableRedirect) requestOpts.qs.disableRedirect = 1;

        var parseResponse = function parseResponse(response) {
            var responseBody = response.body;
            var contentType = response.headers['content-type'];
            var body = disableBodyParser ? responseBody : (0, _utils.parseBody)(responseBody, contentType);

            return {
                contentType: contentType,
                body: body
            };
        };

        return requestPromise(requestOpts).then(parseResponse).catch(_utils.catchNotFoundOrThrow);
    },

    /**
     * Saves the record into key-value store.
     *
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param {String} options.storeId - Unique store Id
     * @param {String} options.key - Key of the record
     * @param {String} options.contentType - Content type of body
     * @param {string|Buffer} options.body - Body in string or Buffer
     * @param callback
     * @returns {*}
     */
    putRecord: function putRecord(requestPromise, options) {
        var baseUrl = options.baseUrl,
            storeId = options.storeId,
            key = options.key,
            body = options.body,
            _options$contentType = options.contentType,
            contentType = _options$contentType === undefined ? 'text/plain; charset=utf-8' : _options$contentType;

        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(storeId, 'storeId', 'String');
        (0, _utils.checkParamOrThrow)(key, 'key', 'String');
        (0, _utils.checkParamOrThrow)(contentType, 'contentType', 'String');

        (0, _utils.checkParamOrThrow)(body, 'body', 'Buffer | String');

        return (0, _utils.gzipPromise)(options.promise, body).then(function (gzipedBody) {
            var requestOpts = {
                url: '' + baseUrl + BASE_PATH + '/' + storeId + '/records/' + key,
                method: 'PUT',
                body: gzipedBody,
                json: false,
                headers: {
                    'Content-Type': contentType,
                    'Content-Encoding': 'gzip'
                }
            };

            // Uploading via our servers:
            if (gzipedBody.length < SIGNED_URL_UPLOAD_MIN_BYTESIZE) return requestPromise(requestOpts);

            // ... or via signed url directly to S3:
            return requestPromise({
                url: '' + baseUrl + BASE_PATH + '/' + storeId + '/records/' + key + '/direct-upload-url',
                method: 'GET',
                json: true,
                headers: {
                    'Content-Type': contentType
                }
            }).then(function (response) {
                var signedUrl = response.data.signedUrl;
                var s3RequestOpts = Object.assign({}, requestOpts, { url: signedUrl });

                return requestPromise(s3RequestOpts);
            });
        });
    },

    /**
     * Deletes given record.
     *
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param {Object} options
     * @param {String} options.storeId - Unique store Id
     * @param {String} options.key - Key of the record
     * @param callback
     */
    deleteRecord: function deleteRecord(requestPromise, options) {
        var baseUrl = options.baseUrl,
            storeId = options.storeId,
            key = options.key;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(storeId, 'storeId', 'String');
        (0, _utils.checkParamOrThrow)(key, 'key', 'String');

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + storeId + '/records/' + key,
            json: true,
            method: 'DELETE'
        });
    },

    /**
     * Returns an array containing objects representing keys in given store.
     * @description You can paginated using exclusiveStartKey and limit parameters.
     * @memberof ApifyClient.keyValueStores
     * @instance
     * @param requestPromise
     * @param {Object} options
     * @param {String} options.storeId - Unique store Id
     * @param {String} [options.exclusiveStartKey] - All keys up to this one (including) are skipped from the result.
     * @param {Number} [options.limit] - Number of keys to be returned. Maximum value is 1000
     * @param callback
     * @returns {PaginationList}
     */
    listKeys: function listKeys(requestPromise, options) {
        var baseUrl = options.baseUrl,
            storeId = options.storeId,
            exclusiveStartKey = options.exclusiveStartKey,
            limit = options.limit;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(storeId, 'storeId', 'String');
        (0, _utils.checkParamOrThrow)(exclusiveStartKey, 'exclusiveStartKey', 'Maybe String');
        (0, _utils.checkParamOrThrow)(limit, 'limit', 'Maybe Number');

        var query = {};

        if (exclusiveStartKey) query.exclusiveStartKey = exclusiveStartKey;
        if (limit) query.limit = limit;

        var requestOpts = {
            url: '' + baseUrl + BASE_PATH + '/' + storeId + '/keys',
            json: true,
            method: 'GET',
            qs: query
        };

        return requestPromise(requestOpts).then(_utils.pluckData);
    }
};