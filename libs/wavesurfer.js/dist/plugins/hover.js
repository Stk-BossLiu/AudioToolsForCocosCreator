"use strict";
/**
 * The Hover plugin follows the mouse and shows a timestamp
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_plugin_js_1 = __importDefault(require("../base-plugin.js"));
var dom_js_1 = __importDefault(require("../dom.js"));
var defaultOptions = {
    lineWidth: 1,
    labelSize: 11,
    formatTimeCallback: function (seconds) {
        var minutes = Math.floor(seconds / 60);
        var secondsRemainder = Math.floor(seconds) % 60;
        var paddedSeconds = "0".concat(secondsRemainder).slice(-2);
        return "".concat(minutes, ":").concat(paddedSeconds);
    },
};
var HoverPlugin = /** @class */ (function (_super) {
    __extends(HoverPlugin, _super);
    function HoverPlugin(options) {
        var _this = _super.call(this, options || {}) || this;
        _this.unsubscribe = function () { return undefined; };
        _this.onPointerMove = function (e) {
            if (!_this.wavesurfer)
                return;
            // Position
            var bbox = _this.wavesurfer.getWrapper().getBoundingClientRect();
            var width = bbox.width;
            var offsetX = e.clientX - bbox.left;
            var relX = Math.min(1, Math.max(0, offsetX / width));
            var posX = Math.min(width - _this.options.lineWidth - 1, offsetX);
            _this.wrapper.style.transform = "translateX(".concat(posX, "px)");
            _this.wrapper.style.opacity = '1';
            // Timestamp
            var duration = _this.wavesurfer.getDuration() || 0;
            _this.label.textContent = _this.options.formatTimeCallback(duration * relX);
            var labelWidth = _this.label.offsetWidth;
            _this.label.style.transform =
                posX + labelWidth > width ? "translateX(-".concat(labelWidth + _this.options.lineWidth, "px)") : '';
            // Emit a hover event with the relative X position
            _this.emit('hover', relX);
        };
        _this.onPointerLeave = function () {
            _this.wrapper.style.opacity = '0';
        };
        _this.options = Object.assign({}, defaultOptions, options);
        // Create the plugin elements
        _this.wrapper = (0, dom_js_1.default)('div', { part: 'hover' });
        _this.label = (0, dom_js_1.default)('span', { part: 'hover-label' }, _this.wrapper);
        return _this;
    }
    HoverPlugin.create = function (options) {
        return new HoverPlugin(options);
    };
    HoverPlugin.prototype.addUnits = function (value) {
        var units = typeof value === 'number' ? 'px' : '';
        return "".concat(value).concat(units);
    };
    /** Called by wavesurfer, don't call manually */
    HoverPlugin.prototype.onInit = function () {
        var _this = this;
        if (!this.wavesurfer) {
            throw Error('WaveSurfer is not initialized');
        }
        var wsOptions = this.wavesurfer.options;
        var lineColor = this.options.lineColor || wsOptions.cursorColor || wsOptions.progressColor;
        // Vertical line
        Object.assign(this.wrapper.style, {
            position: 'absolute',
            zIndex: 10,
            left: 0,
            top: 0,
            height: '100%',
            pointerEvents: 'none',
            borderLeft: "".concat(this.addUnits(this.options.lineWidth), " solid ").concat(lineColor),
            opacity: '0',
            transition: 'opacity .1s ease-in',
        });
        // Timestamp label
        Object.assign(this.label.style, {
            display: 'block',
            backgroundColor: this.options.labelBackground,
            color: this.options.labelColor,
            fontSize: "".concat(this.addUnits(this.options.labelSize)),
            transition: 'transform .1s ease-in',
            padding: '2px 3px',
        });
        // Append the wrapper
        var container = this.wavesurfer.getWrapper();
        container.appendChild(this.wrapper);
        // Attach pointer events
        container.addEventListener('pointermove', this.onPointerMove);
        container.addEventListener('pointerleave', this.onPointerLeave);
        container.addEventListener('wheel', this.onPointerMove);
        this.unsubscribe = function () {
            container.removeEventListener('pointermove', _this.onPointerMove);
            container.removeEventListener('pointerleave', _this.onPointerLeave);
            container.removeEventListener('wheel', _this.onPointerLeave);
        };
    };
    /** Unmount */
    HoverPlugin.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.unsubscribe();
        this.wrapper.remove();
    };
    return HoverPlugin;
}(base_plugin_js_1.default));
exports.default = HoverPlugin;
