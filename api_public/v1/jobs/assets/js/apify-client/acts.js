'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BASE_PATH = undefined;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Acts
 * @memberOf ApifyClient
 * @description
 * ### Basic usage
 * Every method can be used as either promise or with callback. If your Node version supports await/async then you can await promise result.
 * ```javascript
 * const ApifyClient = require('apify-client');
 *
 * const apifyClient = new ApifyClient({
 *  userId: 'jklnDMNKLekk',
 *  token: 'SNjkeiuoeD443lpod68dk',
 * });
 *
 * // Awaited promise
 * try {
 *      const crawler = await apifyClient.acts.listActs({});
 *      // Do something acts list ...
 * } catch (err) {
 *      // Do something with error ...
 * }
 *
 * // Promise
 * apifyClient.acts.listActs({})
 * .then((actsList) => {
 *      // Do something actsList ...
 * })
 * .catch((err) => {
 *      // Do something with error ...
 * });
 *
 * // Callback
 * apifyClient.acts.listActs({}, (err, actsList) => {
 *      // Do something with error or actsList ...
 * });
 * ```
 * @namespace acts
 */

var BASE_PATH = exports.BASE_PATH = '/v2/acts';

var replaceSlashWithTilde = function replaceSlashWithTilde(str) {
    return str.replace('/', '~');
};

exports.default = {
    /**
     * Gets list of your acts.
     * @description By default, the objects are sorted by the createdAt field in ascending order,
     * therefore you can use pagination to incrementally fetch all acts while new ones are still being created.
     * To sort them in descending order, use desc: 1 parameter.
     * The endpoint supports pagination using limit and offset parameters and it will not return more than 1000 array elements.
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {Number} [options.offset=0] - Number of array elements that should be skipped at the start.
     * @param {Number} [options.limit=1000] - Maximum number of array elements to return.
     * @param {Number} [options.desc] - If 1 then the objects are sorted by the createdAt field in descending order.
     * @param callback
     * @returns {PaginationList}
     */
    listActs: function listActs(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            offset = options.offset,
            limit = options.limit,
            desc = options.desc;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(limit, 'limit', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(offset, 'offset', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(desc, 'desc', 'Maybe Boolean');

        var query = { token: token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;
        if (desc) query.desc = 1;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH,
            json: true,
            method: 'GET',
            qs: query
        }).then(_utils.pluckData);
    },

    /**
     * Creates a new act.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {Object} options.act
     * @param callback
     * @returns {Act}
     */
    createAct: function createAct(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            act = options.act;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(act, 'act', 'Object');

        return requestPromise({
            url: '' + baseUrl + BASE_PATH,
            json: true,
            method: 'POST',
            qs: { token: token },
            body: act
        }).then(_utils.pluckData);
    },

    /**
     * Updates act.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param {Object} options.act
     * @param callback
     * @returns {Act}
     */
    updateAct: function updateAct(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            act = options.act;

        var safeActId = replaceSlashWithTilde(!actId && act.id ? act.id : actId);

        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(safeActId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(act, 'act', 'Object');

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId,
            json: true,
            method: 'PUT',
            qs: { token: token },
            body: _underscore2.default.omit(act, 'id')
        }).then(_utils.pluckData);
    },

    /**
     * Deletes act.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param callback
     */
    deleteAct: function deleteAct(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');

        var safeActId = replaceSlashWithTilde(actId);

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId,
            json: true,
            method: 'DELETE',
            qs: { token: token }
        });
    },

    /**
     * Gets act object.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param callback
     * @returns {Act}
     */
    getAct: function getAct(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');

        var safeActId = replaceSlashWithTilde(actId);

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId,
            json: true,
            method: 'GET',
            qs: { token: token }
        }).then(_utils.pluckData).catch(_utils.catchNotFoundOrThrow);
    },

    /**
     * Gets list of act runs.
     * @descriptions By default, the objects are sorted by the startedAt field in ascending order,
     * therefore you can use pagination to incrementally fetch all builds while new ones are still being created.
     * To sort them in descending order, use desc: 1 parameter.
     * The endpoint supports pagination using limit and offset parameters and it will not return more than 1000 array elements.
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param {Number} [options.offset=0] - Number of array elements that should be skipped at the start.
     * @param {Number} [options.limit=1000] - Maximum number of array elements to return.
     * @param {Number} [options.desc] - If 1 then the objects are sorted by the createdAt field in descending order.
     * @param callback
     * @returns {PaginationList}
     */
    listRuns: function listRuns(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            offset = options.offset,
            limit = options.limit,
            desc = options.desc;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(limit, 'limit', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(offset, 'offset', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(desc, 'desc', 'Maybe Boolean');

        var safeActId = replaceSlashWithTilde(actId);
        var query = { token: token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;
        if (desc) query.desc = 1;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId + '/runs',
            json: true,
            method: 'GET',
            qs: query
        }).then(_utils.pluckData);
    },

    /**
     * Runs the latest build of given act.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param {String} options.actId - Act ID
     * @param [options.token]
     * @param {String|Buffer} [options.body] - Act input, passed as HTTP POST payload
     * @param {String} [options.contentType] - Content type of act input e.g 'application/json'
     * @param {Number} [options.waitForFinish] - Number of seconds to wait for act to finish. Maximum value is 120s.
                                                 If act doesn't finish in time then act run in RUNNING state is returned.
     * @param {Number} [options.timeout] - Timeout for the act run in seconds. Zero value means there is no timeout.
     * @param {Number} [options.memory] - Amount of memory allocated for the act run, in megabytes.
     * @param {String} [options.build] - Tag or number of the build to run (e.g. <code>latest</code> or <code>1.2.34</code>).
     * @param callback
     * @returns {ActRun}
     */
    runAct: function runAct(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            contentType = options.contentType,
            body = options.body,
            waitForFinish = options.waitForFinish,
            timeout = options.timeout,
            memory = options.memory,
            build = options.build;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'Maybe String');
        (0, _utils.checkParamOrThrow)(contentType, 'contentType', 'Maybe String');
        (0, _utils.checkParamOrThrow)(waitForFinish, 'waitForFinish', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(timeout, 'timeout', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(memory, 'memory', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(build, 'build', 'Maybe String');

        var safeActId = replaceSlashWithTilde(actId);
        var query = {};

        if (waitForFinish) query.waitForFinish = waitForFinish;
        if (timeout) query.timeout = timeout;
        if (memory) query.memory = memory;
        if (build) query.build = build;
        if (token) query.token = token;

        var opts = {
            url: '' + baseUrl + BASE_PATH + '/' + safeActId + '/runs',
            method: 'POST',
            qs: query
        };

        if (contentType) opts.headers = { 'Content-Type': contentType };

        if (body) {
            (0, _utils.checkParamOrThrow)(body, 'body', 'Buffer | String');

            opts.body = body;
        }

        return requestPromise(opts).then(function (response) {
            return JSON.parse(response);
        }).then(_utils.pluckData);
    },

    /**
     * Gets act run.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param {String} options.actId - Act ID
     * @param {String} options.runId - Act run ID
     * @param [options.token]
     * @param {Number} [options.waitForFinish] - Number of seconds to wait for act to finish. Maximum value is 120s.
                                                 If act doesn't finish in time then act run in RUNNING state is returned.
     * @param callback
     * @returns {ActRun}
     */
    getRun: function getRun(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            runId = options.runId,
            waitForFinish = options.waitForFinish;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(runId, 'runId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'Maybe String');
        (0, _utils.checkParamOrThrow)(waitForFinish, 'waitForFinish', 'Maybe Number');

        var safeActId = replaceSlashWithTilde(actId);
        var query = {};

        if (token) query.token = token;
        if (waitForFinish) query.waitForFinish = waitForFinish;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId + '/runs/' + runId,
            json: true,
            method: 'GET',
            qs: query
        }).then(_utils.pluckData).catch(_utils.catchNotFoundOrThrow);
    },

    /**
     * Gets list of act builds.
     * @descriptions By default, the objects are sorted by the startedAt field in ascending order,
     * therefore you can use pagination to incrementally fetch all builds while new ones are still being created.
     * To sort them in descending order, use desc: 1 parameter.
     * The endpoint supports pagination using limit and offset parameters and it will not return more than 1000 array elements.
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param {Number} [options.offset=0] - Number of array elements that should be skipped at the start.
     * @param {Number} [options.limit=1000] - Maximum number of array elements to return.
     * @param {Number} [options.desc] - If 1 then the objects are sorted by the createdAt field in descending order.
     * @param callback
     * @returns {PaginationList}
     */
    listBuilds: function listBuilds(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            offset = options.offset,
            limit = options.limit,
            desc = options.desc;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(limit, 'limit', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(offset, 'offset', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(desc, 'desc', 'Maybe Boolean');

        var safeActId = replaceSlashWithTilde(actId);
        var query = { token: token };

        if (limit) query.limit = limit;
        if (offset) query.offset = offset;
        if (desc) query.desc = 1;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId + '/builds',
            json: true,
            method: 'GET',
            qs: query
        }).then(_utils.pluckData);
    },

    /**
     * Builds given act and returns object of that build.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param {String} options.version - Version of the act to build.
     * @param {Boolean} [options.betaPackages] - If true, the Docker container will be rebuild using layer cache.
                                                 This is to enable quick rebuild during development.
     * @param {Boolean} [options.useCache] - If true, Docker build uses beta versions of 'apify-client' and
                                             'apify' NPM packages, to test new features.
     * @param {String} [options.tag] - Tag that is applied to the build on success. It enables callers of acts to specify which version of act to run.
      betaPackages
     useCache
     tag
     * @param {Number} [options.waitForFinish] - Number of seconds to wait for act to finish. Maximum value is 120s.
                                                 If act doesn't finish in time then act run in RUNNING state is returned.
     * @param callback
     * @returns {ActBuild}
     */
    buildAct: function buildAct(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            waitForFinish = options.waitForFinish,
            version = options.version,
            tag = options.tag,
            betaPackages = options.betaPackages,
            useCache = options.useCache;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(version, 'version', 'String');
        (0, _utils.checkParamOrThrow)(waitForFinish, 'waitForFinish', 'Maybe Number');
        (0, _utils.checkParamOrThrow)(tag, 'tag', 'Maybe String');
        (0, _utils.checkParamOrThrow)(betaPackages, 'betaPackages', 'Maybe Boolean');
        (0, _utils.checkParamOrThrow)(useCache, 'useCache', 'Maybe Boolean');

        var safeActId = replaceSlashWithTilde(actId);
        var query = { token: token, version: version };

        if (waitForFinish) query.waitForFinish = waitForFinish;
        if (betaPackages) query.betaPackages = 1;
        if (useCache) query.useCache = 1;
        if (tag) query.tag = tag;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId + '/builds',
            json: true,
            method: 'POST',
            qs: query
        }).then(_utils.pluckData);
    },

    /**
     * Gets act build.
     *
     * @memberof ApifyClient.acts
     * @instance
     * @param {Object} options
     * @param options.token
     * @param {String} options.actId - Act ID
     * @param {String} options.buildId - Act build ID
     * @param {Number} [options.waitForFinish] - Number of seconds to wait for act to finish. Maximum value is 120s.
                                                 If act doesn't finish in time then act run in RUNNING state is returned.
     * @param callback
     * @returns {ActBuild}
     */
    getBuild: function getBuild(requestPromise, options) {
        var baseUrl = options.baseUrl,
            token = options.token,
            actId = options.actId,
            buildId = options.buildId,
            waitForFinish = options.waitForFinish;


        (0, _utils.checkParamOrThrow)(baseUrl, 'baseUrl', 'String');
        (0, _utils.checkParamOrThrow)(actId, 'actId', 'String');
        (0, _utils.checkParamOrThrow)(token, 'token', 'String');
        (0, _utils.checkParamOrThrow)(buildId, 'buildId', 'String');
        (0, _utils.checkParamOrThrow)(waitForFinish, 'waitForFinish', 'Maybe Number');

        var safeActId = replaceSlashWithTilde(actId);
        var query = { token: token };

        if (waitForFinish) query.waitForFinish = waitForFinish;

        return requestPromise({
            url: '' + baseUrl + BASE_PATH + '/' + safeActId + '/builds/' + buildId,
            json: true,
            method: 'GET',
            qs: query
        }).then(_utils.pluckData).catch(_utils.catchNotFoundOrThrow);
    }

};