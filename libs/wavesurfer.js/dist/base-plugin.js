"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlugin = void 0;
var event_emitter_js_1 = __importDefault(require("./event-emitter.js"));
/** Base class for wavesurfer plugins */
var BasePlugin = /** @class */ (function (_super) {
    __extends(BasePlugin, _super);
    /** Create a plugin instance */
    function BasePlugin(options) {
        var _this = _super.call(this) || this;
        _this.subscriptions = [];
        _this.options = options;
        return _this;
    }
    /** Called after this.wavesurfer is available */
    BasePlugin.prototype.onInit = function () {
        return;
    };
    /** Do not call directly, only called by WavesSurfer internally */
    BasePlugin.prototype._init = function (wavesurfer) {
        this.wavesurfer = wavesurfer;
        this.onInit();
    };
    /** Destroy the plugin and unsubscribe from all events */
    BasePlugin.prototype.destroy = function () {
        this.emit('destroy');
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
    };
    return BasePlugin;
}(event_emitter_js_1.default));
exports.BasePlugin = BasePlugin;
exports.default = BasePlugin;
