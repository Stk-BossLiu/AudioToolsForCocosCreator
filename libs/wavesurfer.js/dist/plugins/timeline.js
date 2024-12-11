"use strict";
/**
 * The Timeline plugin adds timestamps and notches under the waveform.
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
var dom_js_1 = __importDefault(require("../dom.js"));
var defaultOptions = {
    height: 20,
    formatTimeCallback: function (seconds) {
        if (seconds / 60 > 1) {
            // calculate minutes and seconds from seconds count
            var minutes = Math.floor(seconds / 60);
            seconds = Math.round(seconds % 60);
            var paddedSeconds = "".concat(seconds < 10 ? '0' : '').concat(seconds);
            return "".concat(minutes, ":").concat(paddedSeconds);
        }
        var rounded = Math.round(seconds * 1000) / 1000;
        return "".concat(rounded);
    },
};
var TimelinePlugin = /** @class */ (function (_super) {
    __extends(TimelinePlugin, _super);
    function TimelinePlugin(options) {
        var _this = _super.call(this, options || {}) || this;
        _this.options = Object.assign({}, defaultOptions, options);
        _this.timelineWrapper = _this.initTimelineWrapper();
        return _this;
    }
    TimelinePlugin.create = function (options) {
        return new TimelinePlugin(options);
    };
    /** Called by wavesurfer, don't call manually */
    TimelinePlugin.prototype.onInit = function () {
        var _this = this;
        var _a;
        if (!this.wavesurfer) {
            throw Error('WaveSurfer is not initialized');
        }
        var container = this.wavesurfer.getWrapper();
        if (this.options.container instanceof HTMLElement) {
            container = this.options.container;
        }
        else if (typeof this.options.container === 'string') {
            var el = document.querySelector(this.options.container);
            if (!el)
                throw Error("No Timeline container found matching ".concat(this.options.container));
            container = el;
        }
        if (this.options.insertPosition) {
            ;
            (container.firstElementChild || container).insertAdjacentElement(this.options.insertPosition, this.timelineWrapper);
        }
        else {
            container.appendChild(this.timelineWrapper);
        }
        this.subscriptions.push(this.wavesurfer.on('redraw', function () { return _this.initTimeline(); }));
        if (((_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDuration()) || this.options.duration) {
            this.initTimeline();
        }
    };
    /** Unmount */
    TimelinePlugin.prototype.destroy = function () {
        this.timelineWrapper.remove();
        _super.prototype.destroy.call(this);
    };
    TimelinePlugin.prototype.initTimelineWrapper = function () {
        return (0, dom_js_1.default)('div', { part: 'timeline-wrapper', style: { pointerEvents: 'none' } });
    };
    // Return how many seconds should be between each notch
    TimelinePlugin.prototype.defaultTimeInterval = function (pxPerSec) {
        if (pxPerSec >= 25) {
            return 1;
        }
        else if (pxPerSec * 5 >= 25) {
            return 5;
        }
        else if (pxPerSec * 15 >= 25) {
            return 15;
        }
        return Math.ceil(0.5 / pxPerSec) * 60;
    };
    // Return the cadence of notches that get labels in the primary color.
    TimelinePlugin.prototype.defaultPrimaryLabelInterval = function (pxPerSec) {
        if (pxPerSec >= 25) {
            return 10;
        }
        else if (pxPerSec * 5 >= 25) {
            return 6;
        }
        else if (pxPerSec * 15 >= 25) {
            return 4;
        }
        return 4;
    };
    // Return the cadence of notches that get labels in the secondary color.
    TimelinePlugin.prototype.defaultSecondaryLabelInterval = function (pxPerSec) {
        if (pxPerSec >= 25) {
            return 5;
        }
        else if (pxPerSec * 5 >= 25) {
            return 2;
        }
        else if (pxPerSec * 15 >= 25) {
            return 2;
        }
        return 2;
    };
    TimelinePlugin.prototype.virtualAppend = function (start, container, element) {
        var _this = this;
        var wasVisible = false;
        var renderIfVisible = function (scrollLeft, scrollRight) {
            if (!_this.wavesurfer)
                return;
            var width = element.clientWidth;
            var isVisible = start > scrollLeft && start + width < scrollRight;
            if (isVisible === wasVisible)
                return;
            wasVisible = isVisible;
            if (isVisible) {
                container.appendChild(element);
            }
            else {
                element.remove();
            }
        };
        if (!this.wavesurfer)
            return;
        var scrollLeft = this.wavesurfer.getScroll();
        var scrollRight = scrollLeft + this.wavesurfer.getWidth();
        renderIfVisible(scrollLeft, scrollRight);
        this.subscriptions.push(this.wavesurfer.on('scroll', function (_start, _end, scrollLeft, scrollRight) {
            renderIfVisible(scrollLeft, scrollRight);
        }));
    };
    TimelinePlugin.prototype.initTimeline = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var duration = (_c = (_b = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDuration()) !== null && _b !== void 0 ? _b : this.options.duration) !== null && _c !== void 0 ? _c : 0;
        var pxPerSec = (((_d = this.wavesurfer) === null || _d === void 0 ? void 0 : _d.getWrapper().scrollWidth) || this.timelineWrapper.scrollWidth) / duration;
        var timeInterval = (_e = this.options.timeInterval) !== null && _e !== void 0 ? _e : this.defaultTimeInterval(pxPerSec);
        var primaryLabelInterval = (_f = this.options.primaryLabelInterval) !== null && _f !== void 0 ? _f : this.defaultPrimaryLabelInterval(pxPerSec);
        var primaryLabelSpacing = this.options.primaryLabelSpacing;
        var secondaryLabelInterval = (_g = this.options.secondaryLabelInterval) !== null && _g !== void 0 ? _g : this.defaultSecondaryLabelInterval(pxPerSec);
        var secondaryLabelSpacing = this.options.secondaryLabelSpacing;
        var isTop = this.options.insertPosition === 'beforebegin';
        var timeline = (0, dom_js_1.default)('div', {
            style: __assign({ height: "".concat(this.options.height, "px"), overflow: 'hidden', fontSize: "".concat(this.options.height / 2, "px"), whiteSpace: 'nowrap' }, (isTop
                ? {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    zIndex: '2',
                }
                : {
                    position: 'relative',
                })),
        });
        timeline.setAttribute('part', 'timeline');
        if (typeof this.options.style === 'string') {
            timeline.setAttribute('style', timeline.getAttribute('style') + this.options.style);
        }
        else if (typeof this.options.style === 'object') {
            Object.assign(timeline.style, this.options.style);
        }
        var notchEl = (0, dom_js_1.default)('div', {
            style: {
                width: '0',
                height: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: isTop ? 'flex-start' : 'flex-end',
                top: isTop ? '0' : 'auto',
                bottom: isTop ? 'auto' : '0',
                overflow: 'visible',
                borderLeft: '1px solid currentColor',
                opacity: "".concat((_h = this.options.secondaryLabelOpacity) !== null && _h !== void 0 ? _h : 0.25),
                position: 'absolute',
                zIndex: '1',
            },
        });
        for (var i = 0, notches = 0; i < duration; i += timeInterval, notches++) {
            var notch = notchEl.cloneNode();
            var isPrimary = (Math.round(i * 100) / 100) % primaryLabelInterval === 0 ||
                (primaryLabelSpacing && notches % primaryLabelSpacing === 0);
            var isSecondary = (Math.round(i * 100) / 100) % secondaryLabelInterval === 0 ||
                (secondaryLabelSpacing && notches % secondaryLabelSpacing === 0);
            if (isPrimary || isSecondary) {
                notch.style.height = '100%';
                notch.style.textIndent = '3px';
                notch.textContent = this.options.formatTimeCallback(i);
                if (isPrimary)
                    notch.style.opacity = '1';
            }
            var mode = isPrimary ? 'primary' : isSecondary ? 'secondary' : 'tick';
            notch.setAttribute('part', "timeline-notch timeline-notch-".concat(mode));
            var offset = i * pxPerSec;
            notch.style.left = "".concat(offset, "px");
            this.virtualAppend(offset, timeline, notch);
        }
        this.timelineWrapper.innerHTML = '';
        this.timelineWrapper.appendChild(timeline);
        this.emit('ready');
    };
    return TimelinePlugin;
}(base_plugin_js_1.default));
exports.default = TimelinePlugin;
