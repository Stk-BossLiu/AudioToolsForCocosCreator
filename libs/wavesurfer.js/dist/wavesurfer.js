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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_plugin_js_1 = __importDefault(require("./base-plugin.js"));
var decoder_js_1 = __importDefault(require("./decoder.js"));
var dom = __importStar(require("./dom.js"));
var fetcher_js_1 = __importDefault(require("./fetcher.js"));
var player_js_1 = __importDefault(require("./player.js"));
var renderer_js_1 = __importDefault(require("./renderer.js"));
var timer_js_1 = __importDefault(require("./timer.js"));
var webaudio_js_1 = __importDefault(require("./webaudio.js"));
var defaultOptions = {
    waveColor: '#999',
    progressColor: '#555',
    cursorWidth: 1,
    minPxPerSec: 0,
    fillParent: true,
    interact: true,
    dragToSeek: false,
    autoScroll: true,
    autoCenter: true,
    sampleRate: 8000,
};
var WaveSurfer = /** @class */ (function (_super) {
    __extends(WaveSurfer, _super);
    /** Create a new WaveSurfer instance */
    function WaveSurfer(options) {
        var _this = this;
        var media = options.media ||
            (options.backend === 'WebAudio' ? new webaudio_js_1.default() : undefined);
        _this = _super.call(this, {
            media: media,
            mediaControls: options.mediaControls,
            autoplay: options.autoplay,
            playbackRate: options.audioRate,
        }) || this;
        _this.plugins = [];
        _this.decodedData = null;
        _this.subscriptions = [];
        _this.mediaSubscriptions = [];
        _this.abortController = null;
        _this.options = Object.assign({}, defaultOptions, options);
        _this.timer = new timer_js_1.default();
        var audioElement = media ? undefined : _this.getMediaElement();
        _this.renderer = new renderer_js_1.default(_this.options, audioElement);
        _this.initPlayerEvents();
        _this.initRendererEvents();
        _this.initTimerEvents();
        _this.initPlugins();
        // Read the initial URL before load has been called
        var initialUrl = _this.options.url || _this.getSrc() || '';
        // Init and load async to allow external events to be registered
        Promise.resolve().then(function () {
            _this.emit('init');
            // Load audio if URL or an external media with an src is passed,
            // of render w/o audio if pre-decoded peaks and duration are provided
            var _a = _this.options, peaks = _a.peaks, duration = _a.duration;
            if (initialUrl || (peaks && duration)) {
                // Swallow async errors because they cannot be caught from a constructor call.
                // Subscribe to the wavesurfer's error event to handle them.
                _this.load(initialUrl, peaks, duration).catch(function () { return null; });
            }
        });
        return _this;
    }
    /** Create a new WaveSurfer instance */
    WaveSurfer.create = function (options) {
        return new WaveSurfer(options);
    };
    WaveSurfer.prototype.updateProgress = function (currentTime) {
        if (currentTime === void 0) { currentTime = this.getCurrentTime(); }
        this.renderer.renderProgress(currentTime / this.getDuration(), this.isPlaying());
        return currentTime;
    };
    WaveSurfer.prototype.initTimerEvents = function () {
        var _this = this;
        // The timer fires every 16ms for a smooth progress animation
        this.subscriptions.push(this.timer.on('tick', function () {
            if (!_this.isSeeking()) {
                var currentTime = _this.updateProgress();
                _this.emit('timeupdate', currentTime);
                _this.emit('audioprocess', currentTime);
            }
        }));
    };
    WaveSurfer.prototype.initPlayerEvents = function () {
        var _this = this;
        if (this.isPlaying()) {
            this.emit('play');
            this.timer.start();
        }
        this.mediaSubscriptions.push(this.onMediaEvent('timeupdate', function () {
            var currentTime = _this.updateProgress();
            _this.emit('timeupdate', currentTime);
        }), this.onMediaEvent('play', function () {
            _this.emit('play');
            _this.timer.start();
        }), this.onMediaEvent('pause', function () {
            _this.emit('pause');
            _this.timer.stop();
        }), this.onMediaEvent('emptied', function () {
            _this.timer.stop();
        }), this.onMediaEvent('ended', function () {
            _this.emit('finish');
        }), this.onMediaEvent('seeking', function () {
            _this.emit('seeking', _this.getCurrentTime());
        }), this.onMediaEvent('error', function (err) {
            _this.emit('error', err.error);
        }));
    };
    WaveSurfer.prototype.initRendererEvents = function () {
        var _this = this;
        this.subscriptions.push(
        // Seek on click
        this.renderer.on('click', function (relativeX, relativeY) {
            if (_this.options.interact) {
                _this.seekTo(relativeX);
                _this.emit('interaction', relativeX * _this.getDuration());
                _this.emit('click', relativeX, relativeY);
            }
        }), 
        // Double click
        this.renderer.on('dblclick', function (relativeX, relativeY) {
            _this.emit('dblclick', relativeX, relativeY);
        }), 
        // Scroll
        this.renderer.on('scroll', function (startX, endX, scrollLeft, scrollRight) {
            var duration = _this.getDuration();
            _this.emit('scroll', startX * duration, endX * duration, scrollLeft, scrollRight);
        }), 
        // Redraw
        this.renderer.on('render', function () {
            _this.emit('redraw');
        }), 
        // RedrawComplete
        this.renderer.on('rendered', function () {
            _this.emit('redrawcomplete');
        }), 
        // DragStart
        this.renderer.on('dragstart', function (relativeX) {
            _this.emit('dragstart', relativeX);
        }), 
        // DragEnd
        this.renderer.on('dragend', function (relativeX) {
            _this.emit('dragend', relativeX);
        }));
        // Drag
        {
            var debounce_1;
            this.subscriptions.push(this.renderer.on('drag', function (relativeX) {
                if (!_this.options.interact)
                    return;
                // Update the visual position
                _this.renderer.renderProgress(relativeX);
                // Set the audio position with a debounce
                clearTimeout(debounce_1);
                var debounceTime;
                if (_this.isPlaying()) {
                    debounceTime = 0;
                }
                else if (_this.options.dragToSeek === true) {
                    debounceTime = 200;
                }
                else if (typeof _this.options.dragToSeek === 'object' && _this.options.dragToSeek !== undefined) {
                    debounceTime = _this.options.dragToSeek['debounceTime'];
                }
                debounce_1 = setTimeout(function () {
                    _this.seekTo(relativeX);
                }, debounceTime);
                _this.emit('interaction', relativeX * _this.getDuration());
                _this.emit('drag', relativeX);
            }));
        }
    };
    WaveSurfer.prototype.initPlugins = function () {
        var _this = this;
        var _a;
        if (!((_a = this.options.plugins) === null || _a === void 0 ? void 0 : _a.length))
            return;
        this.options.plugins.forEach(function (plugin) {
            _this.registerPlugin(plugin);
        });
    };
    WaveSurfer.prototype.unsubscribePlayerEvents = function () {
        this.mediaSubscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
        this.mediaSubscriptions = [];
    };
    /** Set new wavesurfer options and re-render it */
    WaveSurfer.prototype.setOptions = function (options) {
        this.options = Object.assign({}, this.options, options);
        this.renderer.setOptions(this.options);
        if (options.audioRate) {
            this.setPlaybackRate(options.audioRate);
        }
        if (options.mediaControls != null) {
            this.getMediaElement().controls = options.mediaControls;
        }
    };
    /** Register a wavesurfer.js plugin */
    WaveSurfer.prototype.registerPlugin = function (plugin) {
        var _this = this;
        plugin._init(this);
        this.plugins.push(plugin);
        // Unregister plugin on destroy
        this.subscriptions.push(plugin.once('destroy', function () {
            _this.plugins = _this.plugins.filter(function (p) { return p !== plugin; });
        }));
        return plugin;
    };
    /** For plugins only: get the waveform wrapper div */
    WaveSurfer.prototype.getWrapper = function () {
        return this.renderer.getWrapper();
    };
    /** For plugins only: get the scroll container client width */
    WaveSurfer.prototype.getWidth = function () {
        return this.renderer.getWidth();
    };
    /** Get the current scroll position in pixels */
    WaveSurfer.prototype.getScroll = function () {
        return this.renderer.getScroll();
    };
    /** Set the current scroll position in pixels */
    WaveSurfer.prototype.setScroll = function (pixels) {
        return this.renderer.setScroll(pixels);
    };
    /** Move the start of the viewing window to a specific time in the audio (in seconds) */
    WaveSurfer.prototype.setScrollTime = function (time) {
        var percentage = time / this.getDuration();
        this.renderer.setScrollPercentage(percentage);
    };
    /** Get all registered plugins */
    WaveSurfer.prototype.getActivePlugins = function () {
        return this.plugins;
    };
    WaveSurfer.prototype.loadAudio = function (url, blob, channelData, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchParams, onProgress, audioDuration, media, arrayBuffer, _a;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.emit('load', url);
                        if (!this.options.media && this.isPlaying())
                            this.pause();
                        this.decodedData = null;
                        if (!(!blob && !channelData)) return [3 /*break*/, 2];
                        fetchParams = this.options.fetchParams || {};
                        if (window.AbortController && !fetchParams.signal) {
                            this.abortController = new AbortController();
                            fetchParams.signal = (_b = this.abortController) === null || _b === void 0 ? void 0 : _b.signal;
                        }
                        onProgress = function (percentage) { return _this.emit('loading', percentage); };
                        return [4 /*yield*/, fetcher_js_1.default.fetchBlob(url, onProgress, fetchParams)];
                    case 1:
                        blob = _c.sent();
                        _c.label = 2;
                    case 2:
                        // Set the mediaelement source
                        this.setSrc(url, blob);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var staticDuration = duration || _this.getDuration();
                                if (staticDuration) {
                                    resolve(staticDuration);
                                }
                                else {
                                    _this.mediaSubscriptions.push(_this.onMediaEvent('loadedmetadata', function () { return resolve(_this.getDuration()); }, { once: true }));
                                }
                            })
                            // Set the duration if the player is a WebAudioPlayer without a URL
                        ];
                    case 3:
                        audioDuration = _c.sent();
                        // Set the duration if the player is a WebAudioPlayer without a URL
                        if (!url && !blob) {
                            media = this.getMediaElement();
                            if (media instanceof webaudio_js_1.default) {
                                media.duration = audioDuration;
                            }
                        }
                        if (!channelData) return [3 /*break*/, 4];
                        this.decodedData = decoder_js_1.default.createBuffer(channelData, audioDuration || 0);
                        return [3 /*break*/, 7];
                    case 4:
                        if (!blob) return [3 /*break*/, 7];
                        return [4 /*yield*/, blob.arrayBuffer()];
                    case 5:
                        arrayBuffer = _c.sent();
                        _a = this;
                        return [4 /*yield*/, decoder_js_1.default.decode(arrayBuffer, this.options.sampleRate)];
                    case 6:
                        _a.decodedData = _c.sent();
                        _c.label = 7;
                    case 7:
                        if (this.decodedData) {
                            this.emit('decode', this.getDuration());
                            this.renderer.render(this.decodedData);
                        }
                        this.emit('ready', this.getDuration());
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Load an audio file by URL, with optional pre-decoded audio data */
    WaveSurfer.prototype.load = function (url, channelData, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadAudio(url, undefined, channelData, duration)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        this.emit('error', err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Load an audio blob */
    WaveSurfer.prototype.loadBlob = function (blob, channelData, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadAudio('', blob, channelData, duration)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_2 = _a.sent();
                        this.emit('error', err_2);
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /** Zoom the waveform by a given pixels-per-second factor */
    WaveSurfer.prototype.zoom = function (minPxPerSec) {
        if (!this.decodedData) {
            throw new Error('No audio loaded');
        }
        this.renderer.zoom(minPxPerSec);
        this.emit('zoom', minPxPerSec);
    };
    /** Get the decoded audio data */
    WaveSurfer.prototype.getDecodedData = function () {
        return this.decodedData;
    };
    /** Get decoded peaks */
    WaveSurfer.prototype.exportPeaks = function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.channels, channels = _c === void 0 ? 2 : _c, _d = _b.maxLength, maxLength = _d === void 0 ? 8000 : _d, _e = _b.precision, precision = _e === void 0 ? 10000 : _e;
        if (!this.decodedData) {
            throw new Error('The audio has not been decoded yet');
        }
        var maxChannels = Math.min(channels, this.decodedData.numberOfChannels);
        var peaks = [];
        for (var i = 0; i < maxChannels; i++) {
            var channel = this.decodedData.getChannelData(i);
            var data = [];
            var sampleSize = channel.length / maxLength;
            for (var i_1 = 0; i_1 < maxLength; i_1++) {
                var sample = channel.slice(Math.floor(i_1 * sampleSize), Math.ceil((i_1 + 1) * sampleSize));
                var max = 0;
                for (var x = 0; x < sample.length; x++) {
                    var n = sample[x];
                    if (Math.abs(n) > Math.abs(max))
                        max = n;
                }
                data.push(Math.round(max * precision) / precision);
            }
            peaks.push(data);
        }
        return peaks;
    };
    /** Get the duration of the audio in seconds */
    WaveSurfer.prototype.getDuration = function () {
        var duration = _super.prototype.getDuration.call(this) || 0;
        // Fall back to the decoded data duration if the media duration is incorrect
        if ((duration === 0 || duration === Infinity) && this.decodedData) {
            duration = this.decodedData.duration;
        }
        return duration;
    };
    /** Toggle if the waveform should react to clicks */
    WaveSurfer.prototype.toggleInteraction = function (isInteractive) {
        this.options.interact = isInteractive;
    };
    /** Jump to a specific time in the audio (in seconds) */
    WaveSurfer.prototype.setTime = function (time) {
        _super.prototype.setTime.call(this, time);
        this.updateProgress(time);
        this.emit('timeupdate', time);
    };
    /** Seek to a percentage of audio as [0..1] (0 = beginning, 1 = end) */
    WaveSurfer.prototype.seekTo = function (progress) {
        var time = this.getDuration() * progress;
        this.setTime(time);
    };
    /** Play or pause the audio */
    WaveSurfer.prototype.playPause = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.isPlaying() ? this.pause() : this.play()];
            });
        });
    };
    /** Stop the audio and go to the beginning */
    WaveSurfer.prototype.stop = function () {
        this.pause();
        this.setTime(0);
    };
    /** Skip N or -N seconds from the current position */
    WaveSurfer.prototype.skip = function (seconds) {
        this.setTime(this.getCurrentTime() + seconds);
    };
    /** Empty the waveform */
    WaveSurfer.prototype.empty = function () {
        this.load('', [[0]], 0.001);
    };
    /** Set HTML media element */
    WaveSurfer.prototype.setMediaElement = function (element) {
        this.unsubscribePlayerEvents();
        _super.prototype.setMediaElement.call(this, element);
        this.initPlayerEvents();
    };
    WaveSurfer.prototype.exportImage = function () {
        return __awaiter(this, arguments, void 0, function (format, quality, type) {
            if (format === void 0) { format = 'image/png'; }
            if (quality === void 0) { quality = 1; }
            if (type === void 0) { type = 'dataURL'; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.renderer.exportImage(format, quality, type)];
            });
        });
    };
    /** Unmount wavesurfer */
    WaveSurfer.prototype.destroy = function () {
        var _a;
        this.emit('destroy');
        (_a = this.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        this.plugins.forEach(function (plugin) { return plugin.destroy(); });
        this.subscriptions.forEach(function (unsubscribe) { return unsubscribe(); });
        this.unsubscribePlayerEvents();
        this.timer.destroy();
        this.renderer.destroy();
        _super.prototype.destroy.call(this);
    };
    WaveSurfer.BasePlugin = base_plugin_js_1.default;
    WaveSurfer.dom = dom;
    return WaveSurfer;
}(player_js_1.default));
exports.default = WaveSurfer;
