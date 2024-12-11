"use strict";
/**
 * Zoom plugin
 *
 * Zoom in or out on the waveform when scrolling the mouse wheel
 *
 * @author HoodyHuo (https://github.com/HoodyHuo)
 * @author Chris Morbitzer (https://github.com/cmorbitzer)
 * @author Sam Hulick (https://github.com/ffxsam)
 * @autor Gustav Sollenius (https://github.com/gustavsollenius)
 *
 * @example
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     ZoomPlugin.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
var base_plugin_js_1 = require("../base-plugin.js");
var defaultOptions = {
    scale: 0.5,
    deltaThreshold: 5,
    exponentialZooming: false,
    iterations: 20,
};
var ZoomPlugin = /** @class */ (function (_super) {
    __extends(ZoomPlugin, _super);
    function ZoomPlugin(options) {
        var _this = _super.call(this, options || {}) || this;
        _this.wrapper = undefined;
        _this.container = null;
        _this.accumulatedDelta = 0;
        _this.pointerTime = 0;
        _this.oldX = 0;
        _this.endZoom = 0;
        _this.startZoom = 0;
        _this.onWheel = function (e) {
            if (!_this.wavesurfer || !_this.container || Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
                return;
            }
            // prevent scrolling the sidebar while zooming
            e.preventDefault();
            // Update the accumulated delta...
            _this.accumulatedDelta += -e.deltaY;
            if (_this.startZoom === 0 && _this.options.exponentialZooming) {
                _this.startZoom = _this.wavesurfer.getWrapper().clientWidth / _this.wavesurfer.getDuration();
            }
            // ...and only scroll once we've hit our threshold
            if (_this.options.deltaThreshold === 0 || Math.abs(_this.accumulatedDelta) >= _this.options.deltaThreshold) {
                var duration = _this.wavesurfer.getDuration();
                var oldMinPxPerSec = _this.wavesurfer.options.minPxPerSec === 0
                    ? _this.wavesurfer.getWrapper().scrollWidth / duration
                    : _this.wavesurfer.options.minPxPerSec;
                var x = e.clientX - _this.container.getBoundingClientRect().left;
                var width = _this.container.clientWidth;
                var scrollX_1 = _this.wavesurfer.getScroll();
                // Update pointerTime only if the pointer position has changed. This prevents the waveform from drifting during fixed zooming.
                if (x !== _this.oldX || _this.oldX === 0) {
                    _this.pointerTime = (scrollX_1 + x) / oldMinPxPerSec;
                }
                _this.oldX = x;
                var newMinPxPerSec = _this.calculateNewZoom(oldMinPxPerSec, _this.accumulatedDelta);
                var newLeftSec = (width / newMinPxPerSec) * (x / width);
                if (newMinPxPerSec * duration < width) {
                    _this.wavesurfer.zoom(width / duration);
                    _this.container.scrollLeft = 0;
                }
                else {
                    _this.wavesurfer.zoom(newMinPxPerSec);
                    _this.container.scrollLeft = (_this.pointerTime - newLeftSec) * newMinPxPerSec;
                }
                // Reset the accumulated delta
                _this.accumulatedDelta = 0;
            }
        };
        _this.calculateNewZoom = function (oldZoom, delta) {
            var newZoom;
            if (_this.options.exponentialZooming) {
                var zoomFactor = delta > 0
                    ? Math.pow(_this.endZoom / _this.startZoom, 1 / (_this.options.iterations - 1))
                    : Math.pow(_this.startZoom / _this.endZoom, 1 / (_this.options.iterations - 1));
                newZoom = Math.max(0, oldZoom * zoomFactor);
            }
            else {
                // Default linear zooming
                newZoom = Math.max(0, oldZoom + delta * _this.options.scale);
            }
            return Math.min(newZoom, _this.options.maxZoom);
        };
        _this.options = Object.assign({}, defaultOptions, options);
        return _this;
    }
    ZoomPlugin.create = function (options) {
        return new ZoomPlugin(options);
    };
    ZoomPlugin.prototype.onInit = function () {
        var _a;
        this.wrapper = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getWrapper();
        if (!this.wrapper) {
            return;
        }
        this.container = this.wrapper.parentElement;
        this.container.addEventListener('wheel', this.onWheel);
        if (typeof this.options.maxZoom === 'undefined') {
            this.options.maxZoom = this.container.clientWidth;
        }
        this.endZoom = this.options.maxZoom;
    };
    ZoomPlugin.prototype.destroy = function () {
        if (this.wrapper) {
            this.wrapper.removeEventListener('wheel', this.onWheel);
        }
        _super.prototype.destroy.call(this);
    };
    return ZoomPlugin;
}(base_plugin_js_1.BasePlugin));
exports.default = ZoomPlugin;
