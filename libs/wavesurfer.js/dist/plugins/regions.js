"use strict";
/**
 * Regions are visual overlays on the waveform that can be used to mark segments of audio.
 * Regions can be clicked on, dragged and resized.
 * You can set the color and content of each region, as well as their HTML content.
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
var draggable_js_1 = require("../draggable.js");
var event_emitter_js_1 = __importDefault(require("../event-emitter.js"));
var dom_js_1 = __importDefault(require("../dom.js"));
var SingleRegion = /** @class */ (function (_super) {
    __extends(SingleRegion, _super);
    function SingleRegion(params, totalDuration, numberOfChannels) {
        if (numberOfChannels === void 0) { numberOfChannels = 0; }
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var _this = _super.call(this) || this;
        _this.totalDuration = totalDuration;
        _this.numberOfChannels = numberOfChannels;
        _this.minLength = 0;
        _this.maxLength = Infinity;
        _this.contentEditable = false;
        _this.subscriptions = [];
        _this.subscriptions = [];
        _this.id = params.id || "region-".concat(Math.random().toString(32).slice(2));
        _this.start = _this.clampPosition(params.start);
        _this.end = _this.clampPosition((_a = params.end) !== null && _a !== void 0 ? _a : params.start);
        _this.drag = (_b = params.drag) !== null && _b !== void 0 ? _b : true;
        _this.resize = (_c = params.resize) !== null && _c !== void 0 ? _c : true;
        _this.color = (_d = params.color) !== null && _d !== void 0 ? _d : 'rgba(0, 0, 0, 0.1)';
        _this.minLength = (_e = params.minLength) !== null && _e !== void 0 ? _e : _this.minLength;
        _this.maxLength = (_f = params.maxLength) !== null && _f !== void 0 ? _f : _this.maxLength;
        _this.channelIdx = (_g = params.channelIdx) !== null && _g !== void 0 ? _g : -1;
        _this.contentEditable = (_h = params.contentEditable) !== null && _h !== void 0 ? _h : _this.contentEditable;
        _this.element = _this.initElement();
        _this.setContent(params.content);
        _this.setPart();
        _this.renderPosition();
        _this.initMouseEvents();
        return _this;
    }
    SingleRegion.prototype.clampPosition = function (time) {
        return Math.max(0, Math.min(this.totalDuration, time));
    };
    SingleRegion.prototype.setPart = function () {
        var isMarker = this.start === this.end;
        this.element.setAttribute('part', "".concat(isMarker ? 'marker' : 'region', " ").concat(this.id));
    };
    SingleRegion.prototype.addResizeHandles = function (element) {
        var _this = this;
        var handleStyle = {
            position: 'absolute',
            zIndex: '2',
            width: '6px',
            height: '100%',
            top: '0',
            cursor: 'ew-resize',
            wordBreak: 'keep-all',
        };
        var leftHandle = (0, dom_js_1.default)('div', {
            part: 'region-handle region-handle-left',
            style: __assign(__assign({}, handleStyle), { left: '0', borderLeft: '2px solid rgba(0, 0, 0, 0.5)', borderRadius: '2px 0 0 2px' }),
        }, element);
        var rightHandle = (0, dom_js_1.default)('div', {
            part: 'region-handle region-handle-right',
            style: __assign(__assign({}, handleStyle), { right: '0', borderRight: '2px solid rgba(0, 0, 0, 0.5)', borderRadius: '0 2px 2px 0' }),
        }, element);
        // Resize
        var resizeThreshold = 1;
        this.subscriptions.push((0, draggable_js_1.makeDraggable)(leftHandle, function (dx) { return _this.onResize(dx, 'start'); }, function () { return null; }, function () { return _this.onEndResizing(); }, resizeThreshold), (0, draggable_js_1.makeDraggable)(rightHandle, function (dx) { return _this.onResize(dx, 'end'); }, function () { return null; }, function () { return _this.onEndResizing(); }, resizeThreshold));
    };
    SingleRegion.prototype.removeResizeHandles = function (element) {
        var leftHandle = element.querySelector('[part*="region-handle-left"]');
        var rightHandle = element.querySelector('[part*="region-handle-right"]');
        if (leftHandle) {
            element.removeChild(leftHandle);
        }
        if (rightHandle) {
            element.removeChild(rightHandle);
        }
    };
    SingleRegion.prototype.initElement = function () {
        var isMarker = this.start === this.end;
        var elementTop = 0;
        var elementHeight = 100;
        if (this.channelIdx >= 0 && this.channelIdx < this.numberOfChannels) {
            elementHeight = 100 / this.numberOfChannels;
            elementTop = elementHeight * this.channelIdx;
        }
        var element = (0, dom_js_1.default)('div', {
            style: {
                position: 'absolute',
                top: "".concat(elementTop, "%"),
                height: "".concat(elementHeight, "%"),
                backgroundColor: isMarker ? 'none' : this.color,
                borderLeft: isMarker ? '2px solid ' + this.color : 'none',
                borderRadius: '2px',
                boxSizing: 'border-box',
                transition: 'background-color 0.2s ease',
                cursor: this.drag ? 'grab' : 'default',
                pointerEvents: 'all',
            },
        });
        // Add resize handles
        if (!isMarker && this.resize) {
            this.addResizeHandles(element);
        }
        return element;
    };
    SingleRegion.prototype.renderPosition = function () {
        var start = this.start / this.totalDuration;
        var end = (this.totalDuration - this.end) / this.totalDuration;
        this.element.style.left = "".concat(start * 100, "%");
        this.element.style.right = "".concat(end * 100, "%");
    };
    SingleRegion.prototype.toggleCursor = function (toggle) {
        var _a;
        if (!this.drag || !((_a = this.element) === null || _a === void 0 ? void 0 : _a.style))
            return;
        this.element.style.cursor = toggle ? 'grabbing' : 'grab';
    };
    SingleRegion.prototype.initMouseEvents = function () {
        var _this = this;
        var element = this.element;
        if (!element)
            return;
        element.addEventListener('click', function (e) { return _this.emit('click', e); });
        element.addEventListener('mouseenter', function (e) { return _this.emit('over', e); });
        element.addEventListener('mouseleave', function (e) { return _this.emit('leave', e); });
        element.addEventListener('dblclick', function (e) { return _this.emit('dblclick', e); });
        element.addEventListener('pointerdown', function () { return _this.toggleCursor(true); });
        element.addEventListener('pointerup', function () { return _this.toggleCursor(false); });
        // Drag
        this.subscriptions.push((0, draggable_js_1.makeDraggable)(element, function (dx) { return _this.onMove(dx); }, function () { return _this.toggleCursor(true); }, function () {
            _this.toggleCursor(false);
            _this.drag && _this.emit('update-end');
        }));
        if (this.contentEditable && this.content) {
            this.content.addEventListener('click', function (e) { return _this.onContentClick(e); });
            this.content.addEventListener('blur', function () { return _this.onContentBlur(); });
        }
    };
    SingleRegion.prototype._onUpdate = function (dx, side) {
        if (!this.element.parentElement)
            return;
        var width = this.element.parentElement.getBoundingClientRect().width;
        var deltaSeconds = (dx / width) * this.totalDuration;
        var newStart = !side || side === 'start' ? this.start + deltaSeconds : this.start;
        var newEnd = !side || side === 'end' ? this.end + deltaSeconds : this.end;
        var length = newEnd - newStart;
        if (newStart >= 0 &&
            newEnd <= this.totalDuration &&
            newStart <= newEnd &&
            length >= this.minLength &&
            length <= this.maxLength) {
            this.start = newStart;
            this.end = newEnd;
            this.renderPosition();
            this.emit('update', side);
        }
    };
    SingleRegion.prototype.onMove = function (dx) {
        if (!this.drag)
            return;
        this._onUpdate(dx);
    };
    SingleRegion.prototype.onResize = function (dx, side) {
        if (!this.resize)
            return;
        this._onUpdate(dx, side);
    };
    SingleRegion.prototype.onEndResizing = function () {
        if (!this.resize)
            return;
        this.emit('update-end');
    };
    SingleRegion.prototype.onContentClick = function (event) {
        event.stopPropagation();
        var contentContainer = event.target;
        contentContainer.focus();
        this.emit('click', event);
    };
    SingleRegion.prototype.onContentBlur = function () {
        this.emit('update-end');
    };
    SingleRegion.prototype._setTotalDuration = function (totalDuration) {
        this.totalDuration = totalDuration;
        this.renderPosition();
    };
    /** Play the region from the start */
    SingleRegion.prototype.play = function () {
        this.emit('play');
    };
    /** Set the HTML content of the region */
    SingleRegion.prototype.setContent = function (content) {
        var _a;
        (_a = this.content) === null || _a === void 0 ? void 0 : _a.remove();
        if (!content) {
            this.content = undefined;
            return;
        }
        if (typeof content === 'string') {
            var isMarker = this.start === this.end;
            this.content = (0, dom_js_1.default)('div', {
                style: {
                    padding: "0.2em ".concat(isMarker ? 0.2 : 0.4, "em"),
                    display: 'inline-block',
                },
                textContent: content,
            });
        }
        else {
            this.content = content;
        }
        if (this.contentEditable) {
            this.content.contentEditable = 'true';
        }
        this.content.setAttribute('part', 'region-content');
        this.element.appendChild(this.content);
    };
    /** Update the region's options */
    SingleRegion.prototype.setOptions = function (options) {
        var _a, _b;
        if (options.color) {
            this.color = options.color;
            this.element.style.backgroundColor = this.color;
        }
        if (options.drag !== undefined) {
            this.drag = options.drag;
            this.element.style.cursor = this.drag ? 'grab' : 'default';
        }
        if (options.start !== undefined || options.end !== undefined) {
            var isMarker = this.start === this.end;
            this.start = this.clampPosition((_a = options.start) !== null && _a !== void 0 ? _a : this.start);
            this.end = this.clampPosition((_b = options.end) !== null && _b !== void 0 ? _b : (isMarker ? this.start : this.end));
            this.renderPosition();
            this.setPart();
        }
        if (options.content) {
            this.setContent(options.content);
        }
        if (options.id) {
            this.id = options.id;
            this.setPart();
        }
        if (options.resize !== undefined && options.resize !== this.resize) {
            var isMarker = this.start === this.end;
            this.resize = options.resize;
            if (this.resize && !isMarker) {
                this.addResizeHandles(this.element);
            }
            else {
                this.removeResizeHandles(this.element);
            }
        }
    };
    /** Remove the region */
    SingleRegion.prototype.remove = function () {
        this.emit('remove');
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
        this.element.remove();
        // This violates the type but we want to clean up the DOM reference
        // w/o having to have a nullable type of the element
        this.element = null;
    };
    return SingleRegion;
}(event_emitter_js_1.default));
var RegionsPlugin = /** @class */ (function (_super) {
    __extends(RegionsPlugin, _super);
    /** Create an instance of RegionsPlugin */
    function RegionsPlugin(options) {
        var _this = _super.call(this, options) || this;
        _this.regions = [];
        _this.regionsContainer = _this.initRegionsContainer();
        return _this;
    }
    /** Create an instance of RegionsPlugin */
    RegionsPlugin.create = function (options) {
        return new RegionsPlugin(options);
    };
    /** Called by wavesurfer, don't call manually */
    RegionsPlugin.prototype.onInit = function () {
        var _this = this;
        if (!this.wavesurfer) {
            throw Error('WaveSurfer is not initialized');
        }
        this.wavesurfer.getWrapper().appendChild(this.regionsContainer);
        var activeRegions = [];
        this.subscriptions.push(this.wavesurfer.on('timeupdate', function (currentTime) {
            // Detect when regions are being played
            var playedRegions = _this.regions.filter(function (region) {
                return region.start <= currentTime &&
                    (region.end === region.start ? region.start + 0.05 : region.end) >= currentTime;
            });
            // Trigger region-in when activeRegions doesn't include a played regions
            playedRegions.forEach(function (region) {
                if (!activeRegions.includes(region)) {
                    _this.emit('region-in', region);
                }
            });
            // Trigger region-out when activeRegions include a un-played regions
            activeRegions.forEach(function (region) {
                if (!playedRegions.includes(region)) {
                    _this.emit('region-out', region);
                }
            });
            // Update activeRegions only played regions
            activeRegions = playedRegions;
        }));
    };
    RegionsPlugin.prototype.initRegionsContainer = function () {
        return (0, dom_js_1.default)('div', {
            style: {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                zIndex: '3',
                pointerEvents: 'none',
            },
        });
    };
    /** Get all created regions */
    RegionsPlugin.prototype.getRegions = function () {
        return this.regions;
    };
    RegionsPlugin.prototype.avoidOverlapping = function (region) {
        var _this = this;
        if (!region.content)
            return;
        setTimeout(function () {
            // Check that the label doesn't overlap with other labels
            // If it does, push it down until it doesn't
            var div = region.content;
            var box = div.getBoundingClientRect();
            var overlap = _this.regions
                .map(function (reg) {
                if (reg === region || !reg.content)
                    return 0;
                var otherBox = reg.content.getBoundingClientRect();
                if (box.left < otherBox.left + otherBox.width && otherBox.left < box.left + box.width) {
                    return otherBox.height;
                }
                return 0;
            })
                .reduce(function (sum, val) { return sum + val; }, 0);
            div.style.marginTop = "".concat(overlap, "px");
        }, 10);
    };
    RegionsPlugin.prototype.adjustScroll = function (region) {
        var _a, _b;
        var scrollContainer = (_b = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getWrapper()) === null || _b === void 0 ? void 0 : _b.parentElement;
        if (!scrollContainer)
            return;
        var clientWidth = scrollContainer.clientWidth, scrollWidth = scrollContainer.scrollWidth;
        if (scrollWidth <= clientWidth)
            return;
        var scrollBbox = scrollContainer.getBoundingClientRect();
        var bbox = region.element.getBoundingClientRect();
        var left = bbox.left - scrollBbox.left;
        var right = bbox.right - scrollBbox.left;
        if (left < 0) {
            scrollContainer.scrollLeft += left;
        }
        else if (right > clientWidth) {
            scrollContainer.scrollLeft += right - clientWidth;
        }
    };
    RegionsPlugin.prototype.virtualAppend = function (region, container, element) {
        var _this = this;
        var renderIfVisible = function () {
            if (!_this.wavesurfer)
                return;
            var clientWidth = _this.wavesurfer.getWidth();
            var scrollLeft = _this.wavesurfer.getScroll();
            var scrollWidth = container.clientWidth;
            var duration = _this.wavesurfer.getDuration();
            var start = Math.round((region.start / duration) * scrollWidth);
            var width = Math.round(((region.end - region.start) / duration) * scrollWidth) || 1;
            // Check if the region is between the scrollLeft and scrollLeft + clientWidth
            var isVisible = start + width > scrollLeft && start < scrollLeft + clientWidth;
            if (isVisible && !element.parentElement) {
                container.appendChild(element);
            }
            else if (!isVisible && element.parentElement) {
                element.remove();
            }
        };
        setTimeout(function () {
            if (!_this.wavesurfer)
                return;
            renderIfVisible();
            var unsubscribe = _this.wavesurfer.on('scroll', renderIfVisible);
            _this.subscriptions.push(region.once('remove', unsubscribe), unsubscribe);
        }, 0);
    };
    RegionsPlugin.prototype.saveRegion = function (region) {
        var _a;
        var _this = this;
        this.virtualAppend(region, this.regionsContainer, region.element);
        this.avoidOverlapping(region);
        this.regions.push(region);
        var regionSubscriptions = [
            region.on('update', function (side) {
                // Undefined side indicates that we are dragging not resizing
                if (!side) {
                    _this.adjustScroll(region);
                }
                _this.emit('region-update', region, side);
            }),
            region.on('update-end', function () {
                _this.avoidOverlapping(region);
                _this.emit('region-updated', region);
            }),
            region.on('play', function () {
                var _a, _b;
                (_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.play();
                (_b = _this.wavesurfer) === null || _b === void 0 ? void 0 : _b.setTime(region.start);
            }),
            region.on('click', function (e) {
                _this.emit('region-clicked', region, e);
            }),
            region.on('dblclick', function (e) {
                _this.emit('region-double-clicked', region, e);
            }),
            // Remove the region from the list when it's removed
            region.once('remove', function () {
                regionSubscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
                _this.regions = _this.regions.filter(function (reg) { return reg !== region; });
                _this.emit('region-removed', region);
            }),
        ];
        (_a = this.subscriptions).push.apply(_a, regionSubscriptions);
        this.emit('region-created', region);
    };
    /** Create a region with given parameters */
    RegionsPlugin.prototype.addRegion = function (options) {
        var _this = this;
        var _a, _b;
        if (!this.wavesurfer) {
            throw Error('WaveSurfer is not initialized');
        }
        var duration = this.wavesurfer.getDuration();
        var numberOfChannels = (_b = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDecodedData()) === null || _b === void 0 ? void 0 : _b.numberOfChannels;
        var region = new SingleRegion(options, duration, numberOfChannels);
        if (!duration) {
            this.subscriptions.push(this.wavesurfer.once('ready', function (duration) {
                region._setTotalDuration(duration);
                _this.saveRegion(region);
            }));
        }
        else {
            this.saveRegion(region);
        }
        return region;
    };
    /**
     * Enable creation of regions by dragging on an empty space on the waveform.
     * Returns a function to disable the drag selection.
     */
    RegionsPlugin.prototype.enableDragSelection = function (options, threshold) {
        var _this = this;
        var _a;
        if (threshold === void 0) { threshold = 3; }
        var wrapper = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getWrapper();
        if (!wrapper || !(wrapper instanceof HTMLElement))
            return function () { return undefined; };
        var initialSize = 5;
        var region = null;
        var startX = 0;
        return (0, draggable_js_1.makeDraggable)(wrapper, 
        // On drag move
        function (dx, _dy, x) {
            if (region) {
                // Update the end position of the region
                // If we're dragging to the left, we need to update the start instead
                region._onUpdate(dx, x > startX ? 'end' : 'start');
            }
        }, 
        // On drag start
        function (x) {
            var _a, _b;
            startX = x;
            if (!_this.wavesurfer)
                return;
            var duration = _this.wavesurfer.getDuration();
            var numberOfChannels = (_b = (_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDecodedData()) === null || _b === void 0 ? void 0 : _b.numberOfChannels;
            var width = _this.wavesurfer.getWrapper().getBoundingClientRect().width;
            // Calculate the start time of the region
            var start = (x / width) * duration;
            // Give the region a small initial size
            var end = ((x + initialSize) / width) * duration;
            // Create a region but don't save it until the drag ends
            region = new SingleRegion(__assign(__assign({}, options), { start: start, end: end }), duration, numberOfChannels);
            // Just add it to the DOM for now
            _this.regionsContainer.appendChild(region.element);
        }, 
        // On drag end
        function () {
            if (region) {
                _this.saveRegion(region);
                region = null;
            }
        }, threshold);
    };
    /** Remove all regions */
    RegionsPlugin.prototype.clearRegions = function () {
        var regions = this.regions.slice();
        regions.forEach(function (region) { return region.remove(); });
        this.regions = [];
    };
    /** Destroy the plugin and clean up */
    RegionsPlugin.prototype.destroy = function () {
        this.clearRegions();
        _super.prototype.destroy.call(this);
        this.regionsContainer.remove();
    };
    return RegionsPlugin;
}(base_plugin_js_1.default));
exports.default = RegionsPlugin;
