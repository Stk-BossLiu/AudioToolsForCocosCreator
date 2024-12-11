"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** A simple event emitter that can be used to listen to and emit events. */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.listeners = {};
    }
    /** Subscribe to an event. Returns an unsubscribe function. */
    EventEmitter.prototype.on = function (event, listener, options) {
        var _this = this;
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event].add(listener);
        if (options === null || options === void 0 ? void 0 : options.once) {
            var unsubscribeOnce_1 = function () {
                _this.un(event, unsubscribeOnce_1);
                _this.un(event, listener);
            };
            this.on(event, unsubscribeOnce_1);
            return unsubscribeOnce_1;
        }
        return function () { return _this.un(event, listener); };
    };
    /** Unsubscribe from an event */
    EventEmitter.prototype.un = function (event, listener) {
        var _a;
        (_a = this.listeners[event]) === null || _a === void 0 ? void 0 : _a.delete(listener);
    };
    /** Subscribe to an event only once */
    EventEmitter.prototype.once = function (event, listener) {
        return this.on(event, listener, { once: true });
    };
    /** Clear all events */
    EventEmitter.prototype.unAll = function () {
        this.listeners = {};
    };
    /** Emit an event */
    EventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(function (listener) { return listener.apply(void 0, args); });
        }
    };
    return EventEmitter;
}());
exports.default = EventEmitter;
