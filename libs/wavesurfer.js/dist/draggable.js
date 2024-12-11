"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDraggable = makeDraggable;
function makeDraggable(element, onDrag, onStart, onEnd, threshold, mouseButton, touchDelay) {
    if (threshold === void 0) { threshold = 3; }
    if (mouseButton === void 0) { mouseButton = 0; }
    if (touchDelay === void 0) { touchDelay = 100; }
    if (!element)
        return function () { return void 0; };
    var isTouchDevice = matchMedia('(pointer: coarse)').matches;
    var unsubscribeDocument = function () { return void 0; };
    var onPointerDown = function (event) {
        if (event.button !== mouseButton)
            return;
        event.preventDefault();
        event.stopPropagation();
        var startX = event.clientX;
        var startY = event.clientY;
        var isDragging = false;
        var touchStartTime = Date.now();
        var onPointerMove = function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (isTouchDevice && Date.now() - touchStartTime < touchDelay)
                return;
            var x = event.clientX;
            var y = event.clientY;
            var dx = x - startX;
            var dy = y - startY;
            if (isDragging || Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
                var rect = element.getBoundingClientRect();
                var left = rect.left, top_1 = rect.top;
                if (!isDragging) {
                    onStart === null || onStart === void 0 ? void 0 : onStart(startX - left, startY - top_1);
                    isDragging = true;
                }
                onDrag(dx, dy, x - left, y - top_1);
                startX = x;
                startY = y;
            }
        };
        var onPointerUp = function (event) {
            if (isDragging) {
                var x = event.clientX;
                var y = event.clientY;
                var rect = element.getBoundingClientRect();
                var left = rect.left, top_2 = rect.top;
                onEnd === null || onEnd === void 0 ? void 0 : onEnd(x - left, y - top_2);
            }
            unsubscribeDocument();
        };
        var onPointerLeave = function (e) {
            // Listen to events only on the document and not on inner elements
            if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
                onPointerUp(e);
            }
        };
        var onClick = function (event) {
            if (isDragging) {
                event.stopPropagation();
                event.preventDefault();
            }
        };
        var onTouchMove = function (event) {
            if (isDragging) {
                event.preventDefault();
            }
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
        document.addEventListener('pointerout', onPointerLeave);
        document.addEventListener('pointercancel', onPointerLeave);
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('click', onClick, { capture: true });
        unsubscribeDocument = function () {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('pointerout', onPointerLeave);
            document.removeEventListener('pointercancel', onPointerLeave);
            document.removeEventListener('touchmove', onTouchMove);
            setTimeout(function () {
                document.removeEventListener('click', onClick, { capture: true });
            }, 10);
        };
    };
    element.addEventListener('pointerdown', onPointerDown);
    return function () {
        unsubscribeDocument();
        element.removeEventListener('pointerdown', onPointerDown);
    };
}
