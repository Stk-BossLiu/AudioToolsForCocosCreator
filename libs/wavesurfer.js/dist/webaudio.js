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
var event_emitter_js_1 = __importDefault(require("./event-emitter.js"));
/**
 * A Web Audio buffer player emulating the behavior of an HTML5 Audio element.
 */
var WebAudioPlayer = /** @class */ (function (_super) {
    __extends(WebAudioPlayer, _super);
    function WebAudioPlayer(audioContext) {
        if (audioContext === void 0) { audioContext = new AudioContext(); }
        var _this = _super.call(this) || this;
        _this.bufferNode = null;
        _this.playStartTime = 0;
        _this.playedDuration = 0;
        _this._muted = false;
        _this._playbackRate = 1;
        _this._duration = undefined;
        _this.buffer = null;
        _this.currentSrc = '';
        _this.paused = true;
        _this.crossOrigin = null;
        _this.seeking = false;
        _this.autoplay = false;
        /** Subscribe to an event. Returns an unsubscribe function. */
        _this.addEventListener = _this.on;
        /** Unsubscribe from an event */
        _this.removeEventListener = _this.un;
        _this.audioContext = audioContext;
        _this.gainNode = _this.audioContext.createGain();
        _this.gainNode.connect(_this.audioContext.destination);
        return _this;
    }
    WebAudioPlayer.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(WebAudioPlayer.prototype, "src", {
        get: function () {
            return this.currentSrc;
        },
        set: function (value) {
            var _this = this;
            this.currentSrc = value;
            this._duration = undefined;
            if (!value) {
                this.buffer = null;
                this.emit('emptied');
                return;
            }
            fetch(value)
                .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Failed to fetch ".concat(value, ": ").concat(response.status, " (").concat(response.statusText, ")"));
                }
                return response.arrayBuffer();
            })
                .then(function (arrayBuffer) {
                if (_this.currentSrc !== value)
                    return null;
                return _this.audioContext.decodeAudioData(arrayBuffer);
            })
                .then(function (audioBuffer) {
                if (_this.currentSrc !== value)
                    return;
                _this.buffer = audioBuffer;
                _this.emit('loadedmetadata');
                _this.emit('canplay');
                if (_this.autoplay)
                    _this.play();
            });
        },
        enumerable: false,
        configurable: true
    });
    WebAudioPlayer.prototype._play = function () {
        var _this = this;
        var _a;
        if (!this.paused)
            return;
        this.paused = false;
        (_a = this.bufferNode) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.bufferNode = this.audioContext.createBufferSource();
        if (this.buffer) {
            this.bufferNode.buffer = this.buffer;
        }
        this.bufferNode.playbackRate.value = this._playbackRate;
        this.bufferNode.connect(this.gainNode);
        var currentPos = this.playedDuration * this._playbackRate;
        if (currentPos >= this.duration) {
            currentPos = 0;
            this.playedDuration = 0;
        }
        this.bufferNode.start(this.audioContext.currentTime, currentPos);
        this.playStartTime = this.audioContext.currentTime;
        this.bufferNode.onended = function () {
            if (_this.currentTime >= _this.duration) {
                _this.pause();
                _this.emit('ended');
            }
        };
    };
    WebAudioPlayer.prototype._pause = function () {
        var _a;
        this.paused = true;
        (_a = this.bufferNode) === null || _a === void 0 ? void 0 : _a.stop();
        this.playedDuration += this.audioContext.currentTime - this.playStartTime;
    };
    WebAudioPlayer.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.paused)
                    return [2 /*return*/];
                this._play();
                this.emit('play');
                return [2 /*return*/];
            });
        });
    };
    WebAudioPlayer.prototype.pause = function () {
        if (this.paused)
            return;
        this._pause();
        this.emit('pause');
    };
    WebAudioPlayer.prototype.stopAt = function (timeSeconds) {
        var _this = this;
        var _a, _b;
        var delay = timeSeconds - this.currentTime;
        (_a = this.bufferNode) === null || _a === void 0 ? void 0 : _a.stop(this.audioContext.currentTime + delay);
        (_b = this.bufferNode) === null || _b === void 0 ? void 0 : _b.addEventListener('ended', function () {
            _this.bufferNode = null;
            _this.pause();
        }, { once: true });
    };
    WebAudioPlayer.prototype.setSinkId = function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var ac;
            return __generator(this, function (_a) {
                ac = this.audioContext;
                return [2 /*return*/, ac.setSinkId(deviceId)];
            });
        });
    };
    Object.defineProperty(WebAudioPlayer.prototype, "playbackRate", {
        get: function () {
            return this._playbackRate;
        },
        set: function (value) {
            this._playbackRate = value;
            if (this.bufferNode) {
                this.bufferNode.playbackRate.value = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioPlayer.prototype, "currentTime", {
        get: function () {
            var time = this.paused
                ? this.playedDuration
                : this.playedDuration + (this.audioContext.currentTime - this.playStartTime);
            return time * this._playbackRate;
        },
        set: function (value) {
            var wasPlaying = !this.paused;
            wasPlaying && this._pause();
            this.playedDuration = value / this._playbackRate;
            wasPlaying && this._play();
            this.emit('seeking');
            this.emit('timeupdate');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioPlayer.prototype, "duration", {
        get: function () {
            var _a, _b;
            return (_a = this._duration) !== null && _a !== void 0 ? _a : (((_b = this.buffer) === null || _b === void 0 ? void 0 : _b.duration) || 0);
        },
        set: function (value) {
            this._duration = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioPlayer.prototype, "volume", {
        get: function () {
            return this.gainNode.gain.value;
        },
        set: function (value) {
            this.gainNode.gain.value = value;
            this.emit('volumechange');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WebAudioPlayer.prototype, "muted", {
        get: function () {
            return this._muted;
        },
        set: function (value) {
            if (this._muted === value)
                return;
            this._muted = value;
            if (this._muted) {
                this.gainNode.disconnect();
            }
            else {
                this.gainNode.connect(this.audioContext.destination);
            }
        },
        enumerable: false,
        configurable: true
    });
    WebAudioPlayer.prototype.canPlayType = function (mimeType) {
        return /^(audio|video)\//.test(mimeType);
    };
    /** Get the GainNode used to play the audio. Can be used to attach filters. */
    WebAudioPlayer.prototype.getGainNode = function () {
        return this.gainNode;
    };
    /** Get decoded audio */
    WebAudioPlayer.prototype.getChannelData = function () {
        var channels = [];
        if (!this.buffer)
            return channels;
        var numChannels = this.buffer.numberOfChannels;
        for (var i = 0; i < numChannels; i++) {
            channels.push(this.buffer.getChannelData(i));
        }
        return channels;
    };
    return WebAudioPlayer;
}(event_emitter_js_1.default));
exports.default = WebAudioPlayer;
