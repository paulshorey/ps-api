'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var APIFY_ERROR_NAME = exports.APIFY_ERROR_NAME = 'ApifyError';

var INVALID_PARAMETER_ERROR_TYPE_V1 = exports.INVALID_PARAMETER_ERROR_TYPE_V1 = 'INVALID_PARAMETER';
var INVALID_PARAMETER_ERROR_TYPE_V2 = exports.INVALID_PARAMETER_ERROR_TYPE_V2 = 'indalid-parameter';
var REQUEST_FAILED_ERROR_TYPE_V1 = exports.REQUEST_FAILED_ERROR_TYPE_V1 = 'REQUEST_FAILED';
var REQUEST_FAILED_ERROR_TYPE_V2 = exports.REQUEST_FAILED_ERROR_TYPE_V2 = 'request-failed';
var REQUEST_FAILED_ERROR_MESSAGE = exports.REQUEST_FAILED_ERROR_MESSAGE = 'Server request failed.';
var NOT_FOUND_STATUS_CODE = exports.NOT_FOUND_STATUS_CODE = 404;

var ApifyError = function (_Error) {
    _inherits(ApifyError, _Error);

    function ApifyError(type, message, details) {
        _classCallCheck(this, ApifyError);

        var _this = _possibleConstructorReturn(this, (ApifyError.__proto__ || Object.getPrototypeOf(ApifyError)).call(this, message));

        _this.name = APIFY_ERROR_NAME;
        _this.type = type;
        _this.details = details;

        Error.captureStackTrace(_this, ApifyError);
        return _this;
    }

    return ApifyError;
}(Error);

exports.default = ApifyError;