"use strict";
/**
 * Envelope is a visual UI for controlling the audio volume and add fade-in and fade-out effects.
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
var draggable_js_1 = require("../draggable.js");
var event_emitter_js_1 = __importDefault(require("../event-emitter.js"));
var dom_js_1 = __importDefault(require("../dom.js"));
var defaultOptions = {
    points: [],
    lineWidth: 4,
    lineColor: 'rgba(0, 0, 255, 0.5)',
    dragPointSize: 10,
    dragPointFill: 'rgba(255, 255, 255, 0.8)',
    dragPointStroke: 'rgba(255, 255, 255, 0.8)',
};
var Polyline = /** @class */ (function (_super) {
    __extends(Polyline, _super);
    function Polyline(options, wrapper) {
        var _this = _super.call(this) || this;
        _this.subscriptions = [];
        _this.subscriptions = [];
        _this.options = options;
        _this.polyPoints = new Map();
        var width = wrapper.clientWidth;
        var height = wrapper.clientHeight;
        // SVG element
        var svg = (0, dom_js_1.default)('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '100%',
            height: '100%',
            viewBox: "0 0 ".concat(width, " ").concat(height),
            preserveAspectRatio: 'none',
            style: {
                position: 'absolute',
                left: '0',
                top: '0',
                zIndex: '4',
            },
            part: 'envelope',
        }, wrapper);
        _this.svg = svg;
        // A polyline representing the envelope
        var polyline = (0, dom_js_1.default)('polyline', {
            xmlns: 'http://www.w3.org/2000/svg',
            points: "0,".concat(height, " ").concat(width, ",").concat(height),
            stroke: options.lineColor,
            'stroke-width': options.lineWidth,
            fill: 'none',
            part: 'polyline',
            style: options.dragLine
                ? {
                    cursor: 'row-resize',
                    pointerEvents: 'stroke',
                }
                : {},
        }, svg);
        // Make the polyline draggable along the Y axis
        if (options.dragLine) {
            _this.subscriptions.push((0, draggable_js_1.makeDraggable)(polyline, function (_, dy) {
                var height = svg.viewBox.baseVal.height;
                var points = polyline.points;
                for (var i = 1; i < points.numberOfItems - 1; i++) {
                    var point = points.getItem(i);
                    point.y = Math.min(height, Math.max(0, point.y + dy));
                }
                var circles = svg.querySelectorAll('ellipse');
                Array.from(circles).forEach(function (circle) {
                    var newY = Math.min(height, Math.max(0, Number(circle.getAttribute('cy')) + dy));
                    circle.setAttribute('cy', newY.toString());
                });
                _this.emit('line-move', dy / height);
            }));
        }
        // Listen to double click to add a new point
        svg.addEventListener('dblclick', function (e) {
            var rect = svg.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            _this.emit('point-create', x / rect.width, y / rect.height);
        });
        // Long press on touch devices
        {
            var pressTimer_1;
            var clearTimer_1 = function () { return clearTimeout(pressTimer_1); };
            svg.addEventListener('touchstart', function (e) {
                if (e.touches.length === 1) {
                    pressTimer_1 = window.setTimeout(function () {
                        e.preventDefault();
                        var rect = svg.getBoundingClientRect();
                        var x = e.touches[0].clientX - rect.left;
                        var y = e.touches[0].clientY - rect.top;
                        _this.emit('point-create', x / rect.width, y / rect.height);
                    }, 500);
                }
                else {
                    clearTimer_1();
                }
            });
            svg.addEventListener('touchmove', clearTimer_1);
            svg.addEventListener('touchend', clearTimer_1);
        }
        return _this;
    }
    Polyline.prototype.makeDraggable = function (draggable, onDrag) {
        this.subscriptions.push((0, draggable_js_1.makeDraggable)(draggable, onDrag, function () { return (draggable.style.cursor = 'grabbing'); }, function () { return (draggable.style.cursor = 'grab'); }, 1));
    };
    Polyline.prototype.createCircle = function (x, y) {
        var size = this.options.dragPointSize;
        var radius = size / 2;
        return (0, dom_js_1.default)('ellipse', {
            xmlns: 'http://www.w3.org/2000/svg',
            cx: x,
            cy: y,
            rx: radius,
            ry: radius,
            fill: this.options.dragPointFill,
            stroke: this.options.dragPointStroke,
            'stroke-width': '2',
            style: {
                cursor: 'grab',
                pointerEvents: 'all',
            },
            part: 'envelope-circle',
        }, this.svg);
    };
    Polyline.prototype.removePolyPoint = function (point) {
        var item = this.polyPoints.get(point);
        if (!item)
            return;
        var polyPoint = item.polyPoint, circle = item.circle;
        var points = this.svg.querySelector('polyline').points;
        var index = Array.from(points).findIndex(function (p) { return p.x === polyPoint.x && p.y === polyPoint.y; });
        points.removeItem(index);
        circle.remove();
        this.polyPoints.delete(point);
    };
    Polyline.prototype.addPolyPoint = function (relX, relY, refPoint) {
        var _this = this;
        var svg = this.svg;
        var _a = svg.viewBox.baseVal, width = _a.width, height = _a.height;
        var x = relX * width;
        var y = height - relY * height;
        var threshold = this.options.dragPointSize / 2;
        var newPoint = svg.createSVGPoint();
        newPoint.x = relX * width;
        newPoint.y = height - relY * height;
        var circle = this.createCircle(x, y);
        var points = svg.querySelector('polyline').points;
        var newIndex = Array.from(points).findIndex(function (point) { return point.x >= x; });
        points.insertItemBefore(newPoint, Math.max(newIndex, 1));
        this.polyPoints.set(refPoint, { polyPoint: newPoint, circle: circle });
        this.makeDraggable(circle, function (dx, dy) {
            var newX = newPoint.x + dx;
            var newY = newPoint.y + dy;
            // Remove the point if it's dragged out of the SVG
            if (newX < -threshold || newY < -threshold || newX > width + threshold || newY > height + threshold) {
                _this.emit('point-dragout', refPoint);
                return;
            }
            // Don't allow to drag past the next or previous point
            var next = Array.from(points).find(function (point) { return point.x > newPoint.x; });
            var prev = Array.from(points).findLast(function (point) { return point.x < newPoint.x; });
            if ((next && newX >= next.x) || (prev && newX <= prev.x)) {
                return;
            }
            // Update the point and the circle position
            newPoint.x = newX;
            newPoint.y = newY;
            circle.setAttribute('cx', newX.toString());
            circle.setAttribute('cy', newY.toString());
            // Emit the event passing the point and new relative coordinates
            _this.emit('point-move', refPoint, newX / width, newY / height);
        });
    };
    Polyline.prototype.update = function () {
        var _this = this;
        var svg = this.svg;
        var aspectRatioX = svg.viewBox.baseVal.width / svg.clientWidth;
        var aspectRatioY = svg.viewBox.baseVal.height / svg.clientHeight;
        var circles = svg.querySelectorAll('ellipse');
        circles.forEach(function (circle) {
            var radius = _this.options.dragPointSize / 2;
            var rx = radius * aspectRatioX;
            var ry = radius * aspectRatioY;
            circle.setAttribute('rx', rx.toString());
            circle.setAttribute('ry', ry.toString());
        });
    };
    Polyline.prototype.destroy = function () {
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
        this.polyPoints.clear();
        this.svg.remove();
    };
    return Polyline;
}(event_emitter_js_1.default));
var randomId = function () { return Math.random().toString(36).slice(2); };
var EnvelopePlugin = /** @class */ (function (_super) {
    __extends(EnvelopePlugin, _super);
    /**
     * Create a new Envelope plugin.
     */
    function EnvelopePlugin(options) {
        var _this = _super.call(this, options) || this;
        _this.polyline = null;
        _this.throttleTimeout = null;
        _this.volume = 1;
        _this.points = options.points || [];
        _this.options = Object.assign({}, defaultOptions, options);
        _this.options.lineColor = _this.options.lineColor || defaultOptions.lineColor;
        _this.options.dragPointFill = _this.options.dragPointFill || defaultOptions.dragPointFill;
        _this.options.dragPointStroke = _this.options.dragPointStroke || defaultOptions.dragPointStroke;
        _this.options.dragPointSize = _this.options.dragPointSize || defaultOptions.dragPointSize;
        return _this;
    }
    EnvelopePlugin.create = function (options) {
        return new EnvelopePlugin(options);
    };
    /**
     * Add an envelope point with a given time and volume.
     */
    EnvelopePlugin.prototype.addPoint = function (point) {
        var _a;
        if (!point.id)
            point.id = randomId();
        // Insert the point in the correct position to keep the array sorted
        var index = this.points.findLastIndex(function (p) { return p.time < point.time; });
        this.points.splice(index + 1, 0, point);
        this.emitPoints();
        // Add the point to the polyline if the duration is available
        var duration = (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDuration();
        if (duration) {
            this.addPolyPoint(point, duration);
        }
    };
    /**
     * Remove an envelope point.
     */
    EnvelopePlugin.prototype.removePoint = function (point) {
        var _a;
        var index = this.points.indexOf(point);
        if (index > -1) {
            this.points.splice(index, 1);
            (_a = this.polyline) === null || _a === void 0 ? void 0 : _a.removePolyPoint(point);
            this.emitPoints();
        }
    };
    /**
     * Get all envelope points. Should not be modified directly.
     */
    EnvelopePlugin.prototype.getPoints = function () {
        return this.points;
    };
    /**
     * Set new envelope points.
     */
    EnvelopePlugin.prototype.setPoints = function (newPoints) {
        var _this = this;
        this.points.slice().forEach(function (point) { return _this.removePoint(point); });
        newPoints.forEach(function (point) { return _this.addPoint(point); });
    };
    /**
     * Destroy the plugin instance.
     */
    EnvelopePlugin.prototype.destroy = function () {
        var _a;
        (_a = this.polyline) === null || _a === void 0 ? void 0 : _a.destroy();
        _super.prototype.destroy.call(this);
    };
    /**
     * Get the envelope volume.
     */
    EnvelopePlugin.prototype.getCurrentVolume = function () {
        return this.volume;
    };
    /**
     * Set the envelope volume. 0..1 (more than 1 will boost the volume).
     */
    EnvelopePlugin.prototype.setVolume = function (floatValue) {
        var _a;
        this.volume = floatValue;
        (_a = this.wavesurfer) === null || _a === void 0 ? void 0 : _a.setVolume(floatValue);
    };
    /** Called by wavesurfer, don't call manually */
    EnvelopePlugin.prototype.onInit = function () {
        var _this = this;
        var _a;
        if (!this.wavesurfer) {
            throw Error('WaveSurfer is not initialized');
        }
        var options = this.options;
        options.volume = (_a = options.volume) !== null && _a !== void 0 ? _a : this.wavesurfer.getVolume();
        this.setVolume(options.volume);
        this.subscriptions.push(this.wavesurfer.on('decode', function (duration) {
            _this.initPolyline();
            _this.points.forEach(function (point) {
                _this.addPolyPoint(point, duration);
            });
        }), this.wavesurfer.on('redraw', function () {
            var _a;
            (_a = _this.polyline) === null || _a === void 0 ? void 0 : _a.update();
        }), this.wavesurfer.on('timeupdate', function (time) {
            _this.onTimeUpdate(time);
        }));
    };
    EnvelopePlugin.prototype.emitPoints = function () {
        var _this = this;
        if (this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
        }
        this.throttleTimeout = setTimeout(function () {
            _this.emit('points-change', _this.points);
        }, 200);
    };
    EnvelopePlugin.prototype.initPolyline = function () {
        var _this = this;
        if (this.polyline)
            this.polyline.destroy();
        if (!this.wavesurfer)
            return;
        var wrapper = this.wavesurfer.getWrapper();
        this.polyline = new Polyline(this.options, wrapper);
        this.subscriptions.push(this.polyline.on('point-move', function (point, relativeX, relativeY) {
            var _a;
            var duration = ((_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDuration()) || 0;
            point.time = relativeX * duration;
            point.volume = 1 - relativeY;
            _this.emitPoints();
        }), this.polyline.on('point-dragout', function (point) {
            _this.removePoint(point);
        }), this.polyline.on('point-create', function (relativeX, relativeY) {
            var _a;
            _this.addPoint({
                time: relativeX * (((_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getDuration()) || 0),
                volume: 1 - relativeY,
            });
        }), this.polyline.on('line-move', function (relativeY) {
            var _a;
            _this.points.forEach(function (point) {
                point.volume = Math.min(1, Math.max(0, point.volume - relativeY));
            });
            _this.emitPoints();
            _this.onTimeUpdate(((_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getCurrentTime()) || 0);
        }));
    };
    EnvelopePlugin.prototype.addPolyPoint = function (point, duration) {
        var _a;
        (_a = this.polyline) === null || _a === void 0 ? void 0 : _a.addPolyPoint(point.time / duration, point.volume, point);
    };
    EnvelopePlugin.prototype.onTimeUpdate = function (time) {
        if (!this.wavesurfer)
            return;
        var nextPoint = this.points.find(function (point) { return point.time > time; });
        if (!nextPoint) {
            nextPoint = { time: this.wavesurfer.getDuration() || 0, volume: 0 };
        }
        var prevPoint = this.points.findLast(function (point) { return point.time <= time; });
        if (!prevPoint) {
            prevPoint = { time: 0, volume: 0 };
        }
        var timeDiff = nextPoint.time - prevPoint.time;
        var volumeDiff = nextPoint.volume - prevPoint.volume;
        var newVolume = prevPoint.volume + (time - prevPoint.time) * (volumeDiff / timeDiff);
        var clampedVolume = Math.min(1, Math.max(0, newVolume));
        var roundedVolume = Math.round(clampedVolume * 100) / 100;
        if (roundedVolume !== this.getCurrentVolume()) {
            this.setVolume(roundedVolume);
            this.emit('volume-change', roundedVolume);
        }
    };
    return EnvelopePlugin;
}(base_plugin_js_1.default));
exports.default = EnvelopePlugin;
