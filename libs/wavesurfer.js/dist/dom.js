"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = createElement;
function renderNode(tagName, content) {
    var element = content.xmlns
        ? document.createElementNS(content.xmlns, tagName)
        : document.createElement(tagName);
    for (var _i = 0, _a = Object.entries(content); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (key === 'children') {
            for (var _c = 0, _d = Object.entries(content); _c < _d.length; _c++) {
                var _e = _d[_c], key_1 = _e[0], value_1 = _e[1];
                if (typeof value_1 === 'string') {
                    element.appendChild(document.createTextNode(value_1));
                }
                else {
                    element.appendChild(renderNode(key_1, value_1));
                }
            }
        }
        else if (key === 'style') {
            Object.assign(element.style, value);
        }
        else if (key === 'textContent') {
            element.textContent = value;
        }
        else {
            element.setAttribute(key, value.toString());
        }
    }
    return element;
}
function createElement(tagName, content, container) {
    var el = renderNode(tagName, content || {});
    container === null || container === void 0 ? void 0 : container.appendChild(el);
    return el;
}
exports.default = createElement;
