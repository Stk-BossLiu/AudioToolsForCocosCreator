"use strict";
/**
 * Record audio from the microphone with a real-time waveform preview
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
var base_plugin_js_1 = __importDefault(require("../base-plugin.js"));
var timer_js_1 = __importDefault(require("../timer.js"));
var DEFAULT_BITS_PER_SECOND = 128000;
var DEFAULT_SCROLLING_WAVEFORM_WINDOW = 5;
var FPS = 100;
var MIME_TYPES = ['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/mp3'];
var findSupportedMimeType = function () { return MIME_TYPES.find(function (mimeType) { return MediaRecorder.isTypeSupported(mimeType); }); };
var RecordPlugin = /** @class */ (function (_super) {
    __extends(RecordPlugin, _super);
    /** Create an instance of the Record plugin */
    function RecordPlugin(options) {
        var _a, _b, _c, _d, _e, _f;
        var _this = _super.call(this, __assign(__assign({}, options), { audioBitsPerSecond: (_a = options.audioBitsPerSecond) !== null && _a !== void 0 ? _a : DEFAULT_BITS_PER_SECOND, scrollingWaveform: (_b = options.scrollingWaveform) !== null && _b !== void 0 ? _b : false, scrollingWaveformWindow: (_c = options.scrollingWaveformWindow) !== null && _c !== void 0 ? _c : DEFAULT_SCROLLING_WAVEFORM_WINDOW, continuousWaveform: (_d = options.continuousWaveform) !== null && _d !== void 0 ? _d : false, renderRecordedAudio: (_e = options.renderRecordedAudio) !== null && _e !== void 0 ? _e : true, mediaRecorderTimeslice: (_f = options.mediaRecorderTimeslice) !== null && _f !== void 0 ? _f : undefined })) || this;
        _this.stream = null;
        _this.mediaRecorder = null;
        _this.dataWindow = null;
        _this.isWaveformPaused = false;
        _this.lastStartTime = 0;
        _this.lastDuration = 0;
        _this.duration = 0;
        _this.timer = new timer_js_1.default();
        _this.subscriptions.push(_this.timer.on('tick', function () {
            var currentTime = performance.now() - _this.lastStartTime;
            _this.duration = _this.isPaused() ? _this.duration : _this.lastDuration + currentTime;
            _this.emit('record-progress', _this.duration);
        }));
        return _this;
    }
    /** Create an instance of the Record plugin */
    RecordPlugin.create = function (options) {
        return new RecordPlugin(options || {});
    };
    RecordPlugin.prototype.renderMicStream = function (stream) {
        var _this = this;
        var _a;
        var audioContext = new AudioContext();
        var source = audioContext.createMediaStreamSource(stream);
        var analyser = audioContext.createAnalyser();
        source.connect(analyser);
        if (this.options.continuousWaveform) {
            analyser.fftSize = 32;
        }
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Float32Array(bufferLength);
        var sampleIdx = 0;
        if (this.wavesurfer) {
            (_a = this.originalOptions) !== null && _a !== void 0 ? _a : (this.originalOptions = __assign({}, this.wavesurfer.options));
            this.wavesurfer.options.interact = false;
            if (this.options.scrollingWaveform) {
                this.wavesurfer.options.cursorWidth = 0;
            }
        }
        var drawWaveform = function () {
            var _a, _b, _c, _d;
            if (_this.isWaveformPaused)
                return;
            analyser.getFloatTimeDomainData(dataArray);
            if (_this.options.scrollingWaveform) {
                // Scrolling waveform
                var windowSize = Math.floor((_this.options.scrollingWaveformWindow || 0) * audioContext.sampleRate);
                var newLength = Math.min(windowSize, _this.dataWindow ? _this.dataWindow.length + bufferLength : bufferLength);
                var tempArray = new Float32Array(windowSize); // Always make it the size of the window, filling with zeros by default
                if (_this.dataWindow) {
                    var startIdx = Math.max(0, windowSize - _this.dataWindow.length);
                    tempArray.set(_this.dataWindow.slice(-newLength + bufferLength), startIdx);
                }
                tempArray.set(dataArray, windowSize - bufferLength);
                _this.dataWindow = tempArray;
            }
            else if (_this.options.continuousWaveform) {
                // Continuous waveform
                if (!_this.dataWindow) {
                    var size = _this.options.continuousWaveformDuration
                        ? Math.round(_this.options.continuousWaveformDuration * FPS)
                        : ((_b = (_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.getWidth()) !== null && _b !== void 0 ? _b : 0) * window.devicePixelRatio;
                    _this.dataWindow = new Float32Array(size);
                }
                var maxValue = 0;
                for (var i = 0; i < bufferLength; i++) {
                    var value = Math.abs(dataArray[i]);
                    if (value > maxValue) {
                        maxValue = value;
                    }
                }
                if (sampleIdx + 1 > _this.dataWindow.length) {
                    var tempArray = new Float32Array(_this.dataWindow.length * 2);
                    tempArray.set(_this.dataWindow, 0);
                    _this.dataWindow = tempArray;
                }
                _this.dataWindow[sampleIdx] = maxValue;
                sampleIdx++;
            }
            else {
                _this.dataWindow = dataArray;
            }
            // Render the waveform
            if (_this.wavesurfer) {
                var totalDuration = ((_d = (_c = _this.dataWindow) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) / FPS;
                _this.wavesurfer
                    .load('', [_this.dataWindow], _this.options.scrollingWaveform ? _this.options.scrollingWaveformWindow : totalDuration)
                    .then(function () {
                    if (_this.wavesurfer && _this.options.continuousWaveform) {
                        _this.wavesurfer.setTime(_this.getDuration() / 1000);
                        if (!_this.wavesurfer.options.minPxPerSec) {
                            _this.wavesurfer.setOptions({
                                minPxPerSec: _this.wavesurfer.getWidth() / _this.wavesurfer.getDuration(),
                            });
                        }
                    }
                })
                    .catch(function (err) {
                    console.error('Error rendering real-time recording data:', err);
                });
            }
        };
        var intervalId = setInterval(drawWaveform, 1000 / FPS);
        return {
            onDestroy: function () {
                clearInterval(intervalId);
                source === null || source === void 0 ? void 0 : source.disconnect();
                audioContext === null || audioContext === void 0 ? void 0 : audioContext.close();
            },
            onEnd: function () {
                _this.isWaveformPaused = true;
                clearInterval(intervalId);
                _this.stopMic();
            },
        };
    };
    /** Request access to the microphone and start monitoring incoming audio */
    RecordPlugin.prototype.startMic = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, err_1, _a, onDestroy, onEnd;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                audio: (options === null || options === void 0 ? void 0 : options.deviceId) ? { deviceId: options.deviceId } : true,
                            })];
                    case 1:
                        stream = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _b.sent();
                        throw new Error('Error accessing the microphone: ' + err_1.message);
                    case 3:
                        _a = this.renderMicStream(stream), onDestroy = _a.onDestroy, onEnd = _a.onEnd;
                        this.subscriptions.push(this.once('destroy', onDestroy));
                        this.subscriptions.push(this.once('record-end', onEnd));
                        this.stream = stream;
                        return [2 /*return*/, stream];
                }
            });
        });
    };
    /** Stop monitoring incoming audio */
    RecordPlugin.prototype.stopMic = function () {
        if (!this.stream)
            return;
        this.stream.getTracks().forEach(function (track) { return track.stop(); });
        this.stream = null;
        this.mediaRecorder = null;
    };
    /** Start recording audio from the microphone */
    RecordPlugin.prototype.startRecording = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var stream, _a, mediaRecorder, recordedChunks, emitWithBlob;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.stream;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.startMic(options)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        stream = _a;
                        this.dataWindow = null;
                        mediaRecorder = this.mediaRecorder ||
                            new MediaRecorder(stream, {
                                mimeType: this.options.mimeType || findSupportedMimeType(),
                                audioBitsPerSecond: this.options.audioBitsPerSecond,
                            });
                        this.mediaRecorder = mediaRecorder;
                        this.stopRecording();
                        recordedChunks = [];
                        mediaRecorder.ondataavailable = function (event) {
                            if (event.data.size > 0) {
                                recordedChunks.push(event.data);
                            }
                            _this.emit('record-data-available', event.data);
                        };
                        emitWithBlob = function (ev) {
                            var _a;
                            var blob = new Blob(recordedChunks, { type: mediaRecorder.mimeType });
                            _this.emit(ev, blob);
                            if (_this.options.renderRecordedAudio) {
                                _this.applyOriginalOptionsIfNeeded();
                                (_a = _this.wavesurfer) === null || _a === void 0 ? void 0 : _a.load(URL.createObjectURL(blob));
                            }
                        };
                        mediaRecorder.onpause = function () { return emitWithBlob('record-pause'); };
                        mediaRecorder.onstop = function () { return emitWithBlob('record-end'); };
                        mediaRecorder.start(this.options.mediaRecorderTimeslice);
                        this.lastStartTime = performance.now();
                        this.lastDuration = 0;
                        this.duration = 0;
                        this.isWaveformPaused = false;
                        this.timer.start();
                        this.emit('record-start');
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Get the duration of the recording */
    RecordPlugin.prototype.getDuration = function () {
        return this.duration;
    };
    /** Check if the audio is being recorded */
    RecordPlugin.prototype.isRecording = function () {
        var _a;
        return ((_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.state) === 'recording';
    };
    RecordPlugin.prototype.isPaused = function () {
        var _a;
        return ((_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.state) === 'paused';
    };
    RecordPlugin.prototype.isActive = function () {
        var _a;
        return ((_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.state) !== 'inactive';
    };
    /** Stop the recording */
    RecordPlugin.prototype.stopRecording = function () {
        var _a;
        if (this.isActive()) {
            (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.stop();
            this.timer.stop();
        }
    };
    /** Pause the recording */
    RecordPlugin.prototype.pauseRecording = function () {
        var _a, _b;
        if (this.isRecording()) {
            this.isWaveformPaused = true;
            (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.requestData();
            (_b = this.mediaRecorder) === null || _b === void 0 ? void 0 : _b.pause();
            this.timer.stop();
            this.lastDuration = this.duration;
        }
    };
    /** Resume the recording */
    RecordPlugin.prototype.resumeRecording = function () {
        var _a;
        if (this.isPaused()) {
            this.isWaveformPaused = false;
            (_a = this.mediaRecorder) === null || _a === void 0 ? void 0 : _a.resume();
            this.timer.start();
            this.lastStartTime = performance.now();
            this.emit('record-resume');
        }
    };
    /** Get a list of available audio devices
     * You can use this to get the device ID of the microphone to use with the startMic and startRecording methods
     * Will return an empty array if the browser doesn't support the MediaDevices API or if the user has not granted access to the microphone
     * You can ask for permission to the microphone by calling startMic
     */
    RecordPlugin.getAvailableAudioDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, navigator.mediaDevices
                        .enumerateDevices()
                        .then(function (devices) { return devices.filter(function (device) { return device.kind === 'audioinput'; }); })];
            });
        });
    };
    /** Destroy the plugin */
    RecordPlugin.prototype.destroy = function () {
        this.applyOriginalOptionsIfNeeded();
        _super.prototype.destroy.call(this);
        this.stopRecording();
        this.stopMic();
    };
    RecordPlugin.prototype.applyOriginalOptionsIfNeeded = function () {
        if (this.wavesurfer && this.originalOptions) {
            this.wavesurfer.setOptions(this.originalOptions);
            delete this.originalOptions;
        }
    };
    return RecordPlugin;
}(base_plugin_js_1.default));
exports.default = RecordPlugin;
