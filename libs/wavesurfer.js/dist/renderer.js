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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var draggable_js_1 = require("./draggable.js");
var event_emitter_js_1 = __importDefault(require("./event-emitter.js"));
var Renderer = /** @class */ (function (_super) {
    __extends(Renderer, _super);
    function Renderer(options, audioElement) {
        var _this = _super.call(this) || this;
        _this.timeouts = [];
        _this.isScrollable = false;
        _this.audioData = null;
        _this.resizeObserver = null;
        _this.lastContainerWidth = 0;
        _this.isDragging = false;
        _this.subscriptions = [];
        _this.subscriptions = [];
        _this.options = options;
        var parent = _this.parentFromOptionsContainer(options.container);
        _this.parent = parent;
        var _a = _this.initHtml(), div = _a[0], shadow = _a[1];
        parent.appendChild(div);
        _this.container = div;
        _this.scrollContainer = shadow.querySelector('.scroll');
        _this.wrapper = shadow.querySelector('.wrapper');
        _this.canvasWrapper = shadow.querySelector('.canvases');
        _this.progressWrapper = shadow.querySelector('.progress');
        _this.cursor = shadow.querySelector('.cursor');
        if (audioElement) {
            shadow.appendChild(audioElement);
        }
        _this.initEvents();
        return _this;
    }
    Renderer.prototype.parentFromOptionsContainer = function (container) {
        var parent;
        if (typeof container === 'string') {
            parent = document.querySelector(container);
        }
        else if (container instanceof HTMLElement) {
            parent = container;
        }
        if (!parent) {
            throw new Error('Container not found');
        }
        return parent;
    };
    Renderer.prototype.initEvents = function () {
        var _this = this;
        var getClickPosition = function (e) {
            var rect = _this.wrapper.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var relativeX = x / rect.width;
            var relativeY = y / rect.height;
            return [relativeX, relativeY];
        };
        // Add a click listener
        this.wrapper.addEventListener('click', function (e) {
            var _a = getClickPosition(e), x = _a[0], y = _a[1];
            _this.emit('click', x, y);
        });
        // Add a double click listener
        this.wrapper.addEventListener('dblclick', function (e) {
            var _a = getClickPosition(e), x = _a[0], y = _a[1];
            _this.emit('dblclick', x, y);
        });
        // Drag
        if (this.options.dragToSeek === true || typeof this.options.dragToSeek === 'object') {
            this.initDrag();
        }
        // Add a scroll listener
        this.scrollContainer.addEventListener('scroll', function () {
            var _a = _this.scrollContainer, scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
            var startX = scrollLeft / scrollWidth;
            var endX = (scrollLeft + clientWidth) / scrollWidth;
            _this.emit('scroll', startX, endX, scrollLeft, scrollLeft + clientWidth);
        });
        // Re-render the waveform on container resize
        if (typeof ResizeObserver === 'function') {
            var delay_1 = this.createDelay(100);
            this.resizeObserver = new ResizeObserver(function () {
                delay_1()
                    .then(function () { return _this.onContainerResize(); })
                    .catch(function () { return undefined; });
            });
            this.resizeObserver.observe(this.scrollContainer);
        }
    };
    Renderer.prototype.onContainerResize = function () {
        var width = this.parent.clientWidth;
        if (width === this.lastContainerWidth && this.options.height !== 'auto')
            return;
        this.lastContainerWidth = width;
        this.reRender();
    };
    Renderer.prototype.initDrag = function () {
        var _this = this;
        this.subscriptions.push((0, draggable_js_1.makeDraggable)(this.wrapper, 
        // On drag
        function (_, __, x) {
            _this.emit('drag', Math.max(0, Math.min(1, x / _this.wrapper.getBoundingClientRect().width)));
        }, 
        // On start drag
        function (x) {
            _this.isDragging = true;
            _this.emit('dragstart', Math.max(0, Math.min(1, x / _this.wrapper.getBoundingClientRect().width)));
        }, 
        // On end drag
        function (x) {
            _this.isDragging = false;
            _this.emit('dragend', Math.max(0, Math.min(1, x / _this.wrapper.getBoundingClientRect().width)));
        }));
    };
    Renderer.prototype.getHeight = function (optionsHeight, optionsSplitChannel) {
        var _a;
        var defaultHeight = 128;
        var numberOfChannels = ((_a = this.audioData) === null || _a === void 0 ? void 0 : _a.numberOfChannels) || 1;
        if (optionsHeight == null)
            return defaultHeight;
        if (!isNaN(Number(optionsHeight)))
            return Number(optionsHeight);
        if (optionsHeight === 'auto') {
            var height = this.parent.clientHeight || defaultHeight;
            if (optionsSplitChannel === null || optionsSplitChannel === void 0 ? void 0 : optionsSplitChannel.every(function (channel) { return !channel.overlay; }))
                return height / numberOfChannels;
            return height;
        }
        return defaultHeight;
    };
    Renderer.prototype.initHtml = function () {
        var div = document.createElement('div');
        var shadow = div.attachShadow({ mode: 'open' });
        var cspNonce = this.options.cspNonce && typeof this.options.cspNonce === 'string' ? this.options.cspNonce.replace(/"/g, '') : '';
        shadow.innerHTML = "\n      <style".concat(cspNonce ? " nonce=\"".concat(cspNonce, "\"") : '', ">\n        :host {\n          user-select: none;\n          min-width: 1px;\n        }\n        :host audio {\n          display: block;\n          width: 100%;\n        }\n        :host .scroll {\n          overflow-x: auto;\n          overflow-y: hidden;\n          width: 100%;\n          position: relative;\n        }\n        :host .noScrollbar {\n          scrollbar-color: transparent;\n          scrollbar-width: none;\n        }\n        :host .noScrollbar::-webkit-scrollbar {\n          display: none;\n          -webkit-appearance: none;\n        }\n        :host .wrapper {\n          position: relative;\n          overflow: visible;\n          z-index: 2;\n        }\n        :host .canvases {\n          min-height: ").concat(this.getHeight(this.options.height, this.options.splitChannels), "px;\n        }\n        :host .canvases > div {\n          position: relative;\n        }\n        :host canvas {\n          display: block;\n          position: absolute;\n          top: 0;\n          image-rendering: pixelated;\n        }\n        :host .progress {\n          pointer-events: none;\n          position: absolute;\n          z-index: 2;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          overflow: hidden;\n        }\n        :host .progress > div {\n          position: relative;\n        }\n        :host .cursor {\n          pointer-events: none;\n          position: absolute;\n          z-index: 5;\n          top: 0;\n          left: 0;\n          height: 100%;\n          border-radius: 2px;\n        }\n      </style>\n\n      <div class=\"scroll\" part=\"scroll\">\n        <div class=\"wrapper\" part=\"wrapper\">\n          <div class=\"canvases\" part=\"canvases\"></div>\n          <div class=\"progress\" part=\"progress\"></div>\n          <div class=\"cursor\" part=\"cursor\"></div>\n        </div>\n      </div>\n    ");
        return [div, shadow];
    };
    /** Wavesurfer itself calls this method. Do not call it manually. */
    Renderer.prototype.setOptions = function (options) {
        if (this.options.container !== options.container) {
            var newParent = this.parentFromOptionsContainer(options.container);
            newParent.appendChild(this.container);
            this.parent = newParent;
        }
        if (options.dragToSeek === true || typeof this.options.dragToSeek === 'object') {
            this.initDrag();
        }
        this.options = options;
        // Re-render the waveform
        this.reRender();
    };
    Renderer.prototype.getWrapper = function () {
        return this.wrapper;
    };
    Renderer.prototype.getWidth = function () {
        return this.scrollContainer.clientWidth;
    };
    Renderer.prototype.getScroll = function () {
        return this.scrollContainer.scrollLeft;
    };
    Renderer.prototype.setScroll = function (pixels) {
        this.scrollContainer.scrollLeft = pixels;
    };
    Renderer.prototype.setScrollPercentage = function (percent) {
        var scrollWidth = this.scrollContainer.scrollWidth;
        var scrollStart = scrollWidth * percent;
        this.setScroll(scrollStart);
    };
    Renderer.prototype.destroy = function () {
        var _a, _b;
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
        this.container.remove();
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
        (_b = this.unsubscribeOnScroll) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    Renderer.prototype.createDelay = function (delayMs) {
        if (delayMs === void 0) { delayMs = 10; }
        var timeout;
        var reject;
        var onClear = function () {
            if (timeout)
                clearTimeout(timeout);
            if (reject)
                reject();
        };
        this.timeouts.push(onClear);
        return function () {
            return new Promise(function (resolveFn, rejectFn) {
                onClear();
                reject = rejectFn;
                timeout = setTimeout(function () {
                    timeout = undefined;
                    reject = undefined;
                    resolveFn();
                }, delayMs);
            });
        };
    };
    // Convert array of color values to linear gradient
    Renderer.prototype.convertColorValues = function (color) {
        if (!Array.isArray(color))
            return color || '';
        if (color.length < 2)
            return color[0] || '';
        var canvasElement = document.createElement('canvas');
        var ctx = canvasElement.getContext('2d');
        var gradientHeight = canvasElement.height * (window.devicePixelRatio || 1);
        var gradient = ctx.createLinearGradient(0, 0, 0, gradientHeight);
        var colorStopPercentage = 1 / (color.length - 1);
        color.forEach(function (color, index) {
            var offset = index * colorStopPercentage;
            gradient.addColorStop(offset, color);
        });
        return gradient;
    };
    Renderer.prototype.getPixelRatio = function () {
        return Math.max(1, window.devicePixelRatio || 1);
    };
    Renderer.prototype.renderBarWaveform = function (channelData, options, ctx, vScale) {
        var topChannel = channelData[0];
        var bottomChannel = channelData[1] || channelData[0];
        var length = topChannel.length;
        var _a = ctx.canvas, width = _a.width, height = _a.height;
        var halfHeight = height / 2;
        var pixelRatio = this.getPixelRatio();
        var barWidth = options.barWidth ? options.barWidth * pixelRatio : 1;
        var barGap = options.barGap ? options.barGap * pixelRatio : options.barWidth ? barWidth / 2 : 0;
        var barRadius = options.barRadius || 0;
        var barIndexScale = width / (barWidth + barGap) / length;
        var rectFn = barRadius && 'roundRect' in ctx ? 'roundRect' : 'rect';
        ctx.beginPath();
        var prevX = 0;
        var maxTop = 0;
        var maxBottom = 0;
        for (var i = 0; i <= length; i++) {
            var x = Math.round(i * barIndexScale);
            if (x > prevX) {
                var topBarHeight = Math.round(maxTop * halfHeight * vScale);
                var bottomBarHeight = Math.round(maxBottom * halfHeight * vScale);
                var barHeight = topBarHeight + bottomBarHeight || 1;
                // Vertical alignment
                var y = halfHeight - topBarHeight;
                if (options.barAlign === 'top') {
                    y = 0;
                }
                else if (options.barAlign === 'bottom') {
                    y = height - barHeight;
                }
                ctx[rectFn](prevX * (barWidth + barGap), y, barWidth, barHeight, barRadius);
                prevX = x;
                maxTop = 0;
                maxBottom = 0;
            }
            var magnitudeTop = Math.abs(topChannel[i] || 0);
            var magnitudeBottom = Math.abs(bottomChannel[i] || 0);
            if (magnitudeTop > maxTop)
                maxTop = magnitudeTop;
            if (magnitudeBottom > maxBottom)
                maxBottom = magnitudeBottom;
        }
        ctx.fill();
        ctx.closePath();
    };
    Renderer.prototype.renderLineWaveform = function (channelData, _options, ctx, vScale) {
        var drawChannel = function (index) {
            var channel = channelData[index] || channelData[0];
            var length = channel.length;
            var height = ctx.canvas.height;
            var halfHeight = height / 2;
            var hScale = ctx.canvas.width / length;
            ctx.moveTo(0, halfHeight);
            var prevX = 0;
            var max = 0;
            for (var i = 0; i <= length; i++) {
                var x = Math.round(i * hScale);
                if (x > prevX) {
                    var h = Math.round(max * halfHeight * vScale) || 1;
                    var y = halfHeight + h * (index === 0 ? -1 : 1);
                    ctx.lineTo(prevX, y);
                    prevX = x;
                    max = 0;
                }
                var value = Math.abs(channel[i] || 0);
                if (value > max)
                    max = value;
            }
            ctx.lineTo(prevX, halfHeight);
        };
        ctx.beginPath();
        drawChannel(0);
        drawChannel(1);
        ctx.fill();
        ctx.closePath();
    };
    Renderer.prototype.renderWaveform = function (channelData, options, ctx) {
        ctx.fillStyle = this.convertColorValues(options.waveColor);
        // Custom rendering function
        if (options.renderFunction) {
            options.renderFunction(channelData, ctx);
            return;
        }
        // Vertical scaling
        var vScale = options.barHeight || 1;
        if (options.normalize) {
            var max = Array.from(channelData[0]).reduce(function (max, value) { return Math.max(max, Math.abs(value)); }, 0);
            vScale = max ? 1 / max : 1;
        }
        // Render waveform as bars
        if (options.barWidth || options.barGap || options.barAlign) {
            this.renderBarWaveform(channelData, options, ctx, vScale);
            return;
        }
        // Render waveform as a polyline
        this.renderLineWaveform(channelData, options, ctx, vScale);
    };
    Renderer.prototype.renderSingleCanvas = function (data, options, width, height, offset, canvasContainer, progressContainer) {
        var pixelRatio = this.getPixelRatio();
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = "".concat(width, "px");
        canvas.style.height = "".concat(height, "px");
        canvas.style.left = "".concat(Math.round(offset), "px");
        canvasContainer.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        this.renderWaveform(data, options, ctx);
        // Draw a progress canvas
        if (canvas.width > 0 && canvas.height > 0) {
            var progressCanvas = canvas.cloneNode();
            var progressCtx = progressCanvas.getContext('2d');
            progressCtx.drawImage(canvas, 0, 0);
            // Set the composition method to draw only where the waveform is drawn
            progressCtx.globalCompositeOperation = 'source-in';
            progressCtx.fillStyle = this.convertColorValues(options.progressColor);
            // This rectangle acts as a mask thanks to the composition method
            progressCtx.fillRect(0, 0, canvas.width, canvas.height);
            progressContainer.appendChild(progressCanvas);
        }
    };
    Renderer.prototype.renderMultiCanvas = function (channelData, options, width, height, canvasContainer, progressContainer) {
        var _this = this;
        var pixelRatio = this.getPixelRatio();
        var clientWidth = this.scrollContainer.clientWidth;
        var totalWidth = width / pixelRatio;
        var singleCanvasWidth = Math.min(Renderer.MAX_CANVAS_WIDTH, clientWidth, totalWidth);
        var drawnIndexes = {};
        // Adjust width to avoid gaps between canvases when using bars
        if (options.barWidth || options.barGap) {
            var barWidth = options.barWidth || 0.5;
            var barGap = options.barGap || barWidth / 2;
            var totalBarWidth = barWidth + barGap;
            if (singleCanvasWidth % totalBarWidth !== 0) {
                singleCanvasWidth = Math.floor(singleCanvasWidth / totalBarWidth) * totalBarWidth;
            }
        }
        // Draw a single canvas
        var draw = function (index) {
            if (index < 0 || index >= numCanvases)
                return;
            if (drawnIndexes[index])
                return;
            drawnIndexes[index] = true;
            var offset = index * singleCanvasWidth;
            var clampedWidth = Math.min(totalWidth - offset, singleCanvasWidth);
            if (clampedWidth <= 0)
                return;
            var data = channelData.map(function (channel) {
                var start = Math.floor((offset / totalWidth) * channel.length);
                var end = Math.floor(((offset + clampedWidth) / totalWidth) * channel.length);
                return channel.slice(start, end);
            });
            _this.renderSingleCanvas(data, options, clampedWidth, height, offset, canvasContainer, progressContainer);
        };
        // Clear canvases to avoid too many DOM nodes
        var clearCanvases = function () {
            if (Object.keys(drawnIndexes).length > Renderer.MAX_NODES) {
                canvasContainer.innerHTML = '';
                progressContainer.innerHTML = '';
                drawnIndexes = {};
            }
        };
        // Calculate how many canvases to render
        var numCanvases = Math.ceil(totalWidth / singleCanvasWidth);
        // Render all canvases if the waveform doesn't scroll
        if (!this.isScrollable) {
            for (var i = 0; i < numCanvases; i++) {
                draw(i);
            }
            return;
        }
        // Lazy rendering
        var viewPosition = this.scrollContainer.scrollLeft / totalWidth;
        var startCanvas = Math.floor(viewPosition * numCanvases);
        // Draw the canvases in the viewport first
        draw(startCanvas - 1);
        draw(startCanvas);
        draw(startCanvas + 1);
        // Subscribe to the scroll event to draw additional canvases
        if (numCanvases > 1) {
            this.unsubscribeOnScroll = this.on('scroll', function () {
                var scrollLeft = _this.scrollContainer.scrollLeft;
                var canvasIndex = Math.floor((scrollLeft / totalWidth) * numCanvases);
                clearCanvases();
                draw(canvasIndex - 1);
                draw(canvasIndex);
                draw(canvasIndex + 1);
            });
        }
    };
    Renderer.prototype.renderChannel = function (channelData, _a, width, channelIndex) {
        var overlay = _a.overlay, options = __rest(_a, ["overlay"]);
        // A container for canvases
        var canvasContainer = document.createElement('div');
        var height = this.getHeight(options.height, options.splitChannels);
        canvasContainer.style.height = "".concat(height, "px");
        if (overlay && channelIndex > 0) {
            canvasContainer.style.marginTop = "-".concat(height, "px");
        }
        this.canvasWrapper.style.minHeight = "".concat(height, "px");
        this.canvasWrapper.appendChild(canvasContainer);
        // A container for progress canvases
        var progressContainer = canvasContainer.cloneNode();
        this.progressWrapper.appendChild(progressContainer);
        // Render the waveform
        this.renderMultiCanvas(channelData, options, width, height, canvasContainer, progressContainer);
    };
    Renderer.prototype.render = function (audioData) {
        return __awaiter(this, void 0, void 0, function () {
            var pixelRatio, parentWidth, scrollWidth, useParentWidth, width, i, options, channels;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                // Clear previous timeouts
                this.timeouts.forEach(function (clear) { return clear(); });
                this.timeouts = [];
                // Clear the canvases
                this.canvasWrapper.innerHTML = '';
                this.progressWrapper.innerHTML = '';
                // Width
                if (this.options.width != null) {
                    this.scrollContainer.style.width =
                        typeof this.options.width === 'number' ? "".concat(this.options.width, "px") : this.options.width;
                }
                pixelRatio = this.getPixelRatio();
                parentWidth = this.scrollContainer.clientWidth;
                scrollWidth = Math.ceil(audioData.duration * (this.options.minPxPerSec || 0));
                // Whether the container should scroll
                this.isScrollable = scrollWidth > parentWidth;
                useParentWidth = this.options.fillParent && !this.isScrollable;
                width = (useParentWidth ? parentWidth : scrollWidth) * pixelRatio;
                // Set the width of the wrapper
                this.wrapper.style.width = useParentWidth ? '100%' : "".concat(scrollWidth, "px");
                // Set additional styles
                this.scrollContainer.style.overflowX = this.isScrollable ? 'auto' : 'hidden';
                this.scrollContainer.classList.toggle('noScrollbar', !!this.options.hideScrollbar);
                this.cursor.style.backgroundColor = "".concat(this.options.cursorColor || this.options.progressColor);
                this.cursor.style.width = "".concat(this.options.cursorWidth, "px");
                this.audioData = audioData;
                this.emit('render');
                // Render the waveform
                if (this.options.splitChannels) {
                    // Render a waveform for each channel
                    for (i = 0; i < audioData.numberOfChannels; i++) {
                        options = __assign(__assign({}, this.options), (_a = this.options.splitChannels) === null || _a === void 0 ? void 0 : _a[i]);
                        this.renderChannel([audioData.getChannelData(i)], options, width, i);
                    }
                }
                else {
                    channels = [audioData.getChannelData(0)];
                    if (audioData.numberOfChannels > 1)
                        channels.push(audioData.getChannelData(1));
                    this.renderChannel(channels, this.options, width, 0);
                }
                // Must be emitted asynchronously for backward compatibility
                Promise.resolve().then(function () { return _this.emit('rendered'); });
                return [2 /*return*/];
            });
        });
    };
    Renderer.prototype.reRender = function () {
        var _a;
        (_a = this.unsubscribeOnScroll) === null || _a === void 0 ? void 0 : _a.call(this);
        delete this.unsubscribeOnScroll;
        // Return if the waveform has not been rendered yet
        if (!this.audioData)
            return;
        // Remember the current cursor position
        var scrollWidth = this.scrollContainer.scrollWidth;
        var before = this.progressWrapper.getBoundingClientRect().right;
        // Re-render the waveform
        this.render(this.audioData);
        // Adjust the scroll position so that the cursor stays in the same place
        if (this.isScrollable && scrollWidth !== this.scrollContainer.scrollWidth) {
            var after = this.progressWrapper.getBoundingClientRect().right;
            var delta = after - before;
            // to limit compounding floating-point drift
            // we need to round to the half px furthest from 0
            delta *= 2;
            delta = delta < 0 ? Math.floor(delta) : Math.ceil(delta);
            delta /= 2;
            this.scrollContainer.scrollLeft += delta;
        }
    };
    Renderer.prototype.zoom = function (minPxPerSec) {
        this.options.minPxPerSec = minPxPerSec;
        this.reRender();
    };
    Renderer.prototype.scrollIntoView = function (progress, isPlaying) {
        if (isPlaying === void 0) { isPlaying = false; }
        var _a = this.scrollContainer, scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
        var progressWidth = progress * scrollWidth;
        var startEdge = scrollLeft;
        var endEdge = scrollLeft + clientWidth;
        var middle = clientWidth / 2;
        if (this.isDragging) {
            // Scroll when dragging close to the edge of the viewport
            var minGap = 30;
            if (progressWidth + minGap > endEdge) {
                this.scrollContainer.scrollLeft += minGap;
            }
            else if (progressWidth - minGap < startEdge) {
                this.scrollContainer.scrollLeft -= minGap;
            }
        }
        else {
            if (progressWidth < startEdge || progressWidth > endEdge) {
                this.scrollContainer.scrollLeft = progressWidth - (this.options.autoCenter ? middle : 0);
            }
            // Keep the cursor centered when playing
            var center = progressWidth - scrollLeft - middle;
            if (isPlaying && this.options.autoCenter && center > 0) {
                this.scrollContainer.scrollLeft += Math.min(center, 10);
            }
        }
        // Emit the scroll event
        {
            var newScroll = this.scrollContainer.scrollLeft;
            var startX = newScroll / scrollWidth;
            var endX = (newScroll + clientWidth) / scrollWidth;
            this.emit('scroll', startX, endX, newScroll, newScroll + clientWidth);
        }
    };
    Renderer.prototype.renderProgress = function (progress, isPlaying) {
        if (isNaN(progress))
            return;
        var percents = progress * 100;
        this.canvasWrapper.style.clipPath = "polygon(".concat(percents, "% 0, 100% 0, 100% 100%, ").concat(percents, "% 100%)");
        this.progressWrapper.style.width = "".concat(percents, "%");
        this.cursor.style.left = "".concat(percents, "%");
        this.cursor.style.transform = "translateX(-".concat(Math.round(percents) === 100 ? this.options.cursorWidth : 0, "px)");
        if (this.isScrollable && this.options.autoScroll) {
            this.scrollIntoView(progress, isPlaying);
        }
    };
    Renderer.prototype.exportImage = function (format, quality, type) {
        return __awaiter(this, void 0, void 0, function () {
            var canvases, images;
            return __generator(this, function (_a) {
                canvases = this.canvasWrapper.querySelectorAll('canvas');
                if (!canvases.length) {
                    throw new Error('No waveform data');
                }
                // Data URLs
                if (type === 'dataURL') {
                    images = Array.from(canvases).map(function (canvas) { return canvas.toDataURL(format, quality); });
                    return [2 /*return*/, Promise.resolve(images)];
                }
                // Blobs
                return [2 /*return*/, Promise.all(Array.from(canvases).map(function (canvas) {
                        return new Promise(function (resolve, reject) {
                            canvas.toBlob(function (blob) {
                                blob ? resolve(blob) : reject(new Error('Could not export image'));
                            }, format, quality);
                        });
                    }))];
            });
        });
    };
    Renderer.MAX_CANVAS_WIDTH = 8000;
    Renderer.MAX_NODES = 10;
    return Renderer;
}(event_emitter_js_1.default));
exports.default = Renderer;
