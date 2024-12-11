"use strict";
/**
 * Minimap is a tiny copy of the main waveform serving as a navigation tool.
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_plugin_js_1 = __importDefault(require("../base-plugin.js"));
var wavesurfer_js_1 = __importDefault(require("../wavesurfer.js"));
var dom_js_1 = __importDefault(require("../dom.js"));
var defaultOptions = {
    height: 50,
    overlayColor: 'rgba(100, 100, 100, 0.1)',
    insertPosition: 'afterend',
};
var MinimapPlugin = /** @class */ (function (_super) {
    __extends(MinimapPlugin, _super);
    function MinimapPlugin(options) {
        var _this = _super.call(this, options) || this;
        _this.miniWavesurfer = null;
        _this.container = null;
        _this.options = Object.assign({}, defaultOptions, options);
        _this.minimapWrapper = _this.initMinimapWrapper();
        _this.overlay = _this.initOverlay();
        return _this;
    }
    MinimapPlugin.create = function (options) {
        return new MinimapPlugin(options);
    };
    /** Called by wavesurfer, don't call manually */
    MinimapPlugin.prototype.onInit = function () {
        var _this = this;
        var _a, _b;
        if (!this.wavesurfer) {
            throw Error('WaveSurfer is not initialized');
        }
        if (this.options.container) {
            if (typeof this.options.container === 'string') {
                this.container = document.querySelector(this.options.container);
            }
            else if (this.options.container instanceof HTMLElement) {
                this.container = this.options.container;
            }
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.appendChild(this.minimapWrapper);
        }
        else {
            this.container = this.wavesurfer.getWrapper().parentElement;
            (_b = this.container) === null || _b === void 0 ? void 0 : _b.insertAdjacentElement(this.options.insertPosition, this.minimapWrapper);
        }
        this.initWaveSurferEvents();
        Promise.resolve().then(function () {
            _this.initMinimap();
        });
    };
    MinimapPlugin.prototype.initMinimapWrapper = function () {
        return (0, dom_js_1.default)('div', {
            part: 'minimap',
            style: {
                position: 'relative',
            },
        });
    };
    MinimapPlugin.prototype.initOverlay = function () {
        return (0, dom_js_1.default)('div', {
            part: 'minimap-overlay',
            style: {
                position: 'absolute',
                zIndex: '2',
                left: '0',
                top: '0',
                bottom: '0',
                transition: 'left 100ms ease-out',
                pointerEvents: 'none',
                backgroundColor: this.options.overlayColor,
            },
        }, this.minimapWrapper);
    };
    MinimapPlugin.prototype.initMinimap = function () {
        var _this = this;
        if (this.miniWavesurfer) {
            this.miniWavesurfer.destroy();
            this.miniWavesurfer = null;
        }
        if (!this.wavesurfer)
            return;
        var data = this.wavesurfer.getDecodedData();
        var media = this.wavesurfer.getMediaElement();
        if (!data || !media)
            return;
        var peaks = [];
        for (var i = 0; i < data.numberOfChannels; i++) {
            peaks.push(data.getChannelData(i));
        }
        this.miniWavesurfer = wavesurfer_js_1.default.create(__assign(__assign({}, this.options), { container: this.minimapWrapper, minPxPerSec: 0, fillParent: true, media: media, peaks: peaks, duration: data.duration }));
        this.subscriptions.push(this.miniWavesurfer.on('audioprocess', function (currentTime) {
            _this.emit('audioprocess', currentTime);
        }), this.miniWavesurfer.on('click', function (relativeX, relativeY) {
            _this.emit('click', relativeX, relativeY);
        }), this.miniWavesurfer.on('dblclick', function (relativeX, relativeY) {
            _this.emit('dblclick', relativeX, relativeY);
        }), this.miniWavesurfer.on('decode', function (duration) {
            _this.emit('decode', duration);
        }), this.miniWavesurfer.on('destroy', function () {
            _this.emit('destroy');
        }), this.miniWavesurfer.on('drag', function (relativeX) {
            _this.emit('drag', relativeX);
        }), this.miniWavesurfer.on('dragend', function (relativeX) {
            _this.emit('dragend', relativeX);
        }), this.miniWavesurfer.on('dragstart', function (relativeX) {
            _this.emit('dragstart', relativeX);
        }), this.miniWavesurfer.on('interaction', function () {
            _this.emit('interaction');
        }), this.miniWavesurfer.on('init', function () {
            _this.emit('init');
        }), this.miniWavesurfer.on('ready', function () {
            _this.emit('ready');
        }), this.miniWavesurfer.on('redraw', function () {
            _this.emit('redraw');
        }), this.miniWavesurfer.on('redrawcomplete', function () {
            _this.emit('redrawcomplete');
        }), this.miniWavesurfer.on('seeking', function (currentTime) {
            _this.emit('seeking', currentTime);
        }), this.miniWavesurfer.on('timeupdate', function (currentTime) {
            _this.emit('timeupdate', currentTime);
        }));
    };
    MinimapPlugin.prototype.getOverlayWidth = function () {
        var _a;
        var waveformWidth = ((_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getWrapper().clientWidth) || 1;
        return Math.round((this.minimapWrapper.clientWidth / waveformWidth) * 100);
    };
    MinimapPlugin.prototype.onRedraw = function () {
        var overlayWidth = this.getOverlayWidth();
        this.overlay.style.width = "".concat(overlayWidth, "%");
    };
    MinimapPlugin.prototype.onScroll = function (startTime) {
        if (!this.wavesurfer)
            return;
        var duration = this.wavesurfer.getDuration();
        this.overlay.style.left = "".concat((startTime / duration) * 100, "%");
    };
    MinimapPlugin.prototype.initWaveSurferEvents = function () {
        var _this = this;
        if (!this.wavesurfer)
            return;
        this.subscriptions.push(this.wavesurfer.on('decode', function () {
            _this.initMinimap();
        }), this.wavesurfer.on('scroll', function (startTime) {
            _this.onScroll(startTime);
        }), this.wavesurfer.on('redraw', function () {
            _this.onRedraw();
        }));
    };
    /** Unmount */
    MinimapPlugin.prototype.destroy = function () {
        var _a;
        (_a = this.miniWavesurfer) === null || _a === void 0 ? void 0 : _a.destroy();
        this.minimapWrapper.remove();
        _super.prototype.destroy.call(this);
    };
    return MinimapPlugin;
}(base_plugin_js_1.default));
exports.default = MinimapPlugin;
