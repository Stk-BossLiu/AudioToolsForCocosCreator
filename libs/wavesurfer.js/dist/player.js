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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(options) {
        var _this = _super.call(this) || this;
        _this.isExternalMedia = false;
        if (options.media) {
            _this.media = options.media;
            _this.isExternalMedia = true;
        }
        else {
            _this.media = document.createElement('audio');
        }
        // Controls
        if (options.mediaControls) {
            _this.media.controls = true;
        }
        // Autoplay
        if (options.autoplay) {
            _this.media.autoplay = true;
        }
        // Speed
        if (options.playbackRate != null) {
            _this.onMediaEvent('canplay', function () {
                if (options.playbackRate != null) {
                    _this.media.playbackRate = options.playbackRate;
                }
            }, { once: true });
        }
        return _this;
    }
    Player.prototype.onMediaEvent = function (event, callback, options) {
        var _this = this;
        this.media.addEventListener(event, callback, options);
        return function () { return _this.media.removeEventListener(event, callback, options); };
    };
    Player.prototype.getSrc = function () {
        return this.media.currentSrc || this.media.src || '';
    };
    Player.prototype.revokeSrc = function () {
        var src = this.getSrc();
        if (src.startsWith('blob:')) {
            URL.revokeObjectURL(src);
        }
    };
    Player.prototype.canPlayType = function (type) {
        return this.media.canPlayType(type) !== '';
    };
    Player.prototype.setSrc = function (url, blob) {
        var src = this.getSrc();
        if (url && src === url)
            return;
        this.revokeSrc();
        var newSrc = blob instanceof Blob && (this.canPlayType(blob.type) || !url) ? URL.createObjectURL(blob) : url;
        try {
            this.media.src = newSrc;
        }
        catch (e) {
            this.media.src = url;
        }
    };
    Player.prototype.destroy = function () {
        this.media.pause();
        if (this.isExternalMedia)
            return;
        this.media.remove();
        this.revokeSrc();
        this.media.src = '';
        // Load resets the media element to its initial state
        this.media.load();
    };
    Player.prototype.setMediaElement = function (element) {
        this.media = element;
    };
    /** Start playing the audio */
    Player.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.media.play()];
            });
        });
    };
    /** Pause the audio */
    Player.prototype.pause = function () {
        this.media.pause();
    };
    /** Check if the audio is playing */
    Player.prototype.isPlaying = function () {
        return !this.media.paused && !this.media.ended;
    };
    /** Jump to a specific time in the audio (in seconds) */
    Player.prototype.setTime = function (time) {
        this.media.currentTime = time;
    };
    /** Get the duration of the audio in seconds */
    Player.prototype.getDuration = function () {
        return this.media.duration;
    };
    /** Get the current audio position in seconds */
    Player.prototype.getCurrentTime = function () {
        return this.media.currentTime;
    };
    /** Get the audio volume */
    Player.prototype.getVolume = function () {
        return this.media.volume;
    };
    /** Set the audio volume */
    Player.prototype.setVolume = function (volume) {
        this.media.volume = volume;
    };
    /** Get the audio muted state */
    Player.prototype.getMuted = function () {
        return this.media.muted;
    };
    /** Mute or unmute the audio */
    Player.prototype.setMuted = function (muted) {
        this.media.muted = muted;
    };
    /** Get the playback speed */
    Player.prototype.getPlaybackRate = function () {
        return this.media.playbackRate;
    };
    /** Check if the audio is seeking */
    Player.prototype.isSeeking = function () {
        return this.media.seeking;
    };
    /** Set the playback speed, pass an optional false to NOT preserve the pitch */
    Player.prototype.setPlaybackRate = function (rate, preservePitch) {
        // preservePitch is true by default in most browsers
        if (preservePitch != null) {
            this.media.preservesPitch = preservePitch;
        }
        this.media.playbackRate = rate;
    };
    /** Get the HTML media element */
    Player.prototype.getMediaElement = function () {
        return this.media;
    };
    /** Set a sink id to change the audio output device */
    Player.prototype.setSinkId = function (sinkId) {
        // See https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
        var media = this.media;
        return media.setSinkId(sinkId);
    };
    return Player;
}(event_emitter_js_1.default));
exports.default = Player;
