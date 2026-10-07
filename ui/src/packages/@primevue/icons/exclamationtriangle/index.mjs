import BaseIcon from '@primevue/icons/baseicon';
import { createElementBlock, openBlock, mergeProps, createElementVNode } from 'vue';

var script = {
  name: 'ExclamationTriangleIcon',
  "extends": BaseIcon
};

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", mergeProps({
    width: "14",
    height: "14",
    viewBox: "0 0 512 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _toConsumableArray(_cache[0] || (_cache[0] = [createElementVNode("path", { d: "M256.5 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.6 480 472.5 480l-432 0c-14.1 0-27.1-7.4-34.3-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 32c-2.9 0-5.6 1.6-7 4.2l-216 400c-1.3 2.5-1.3 5.5 .2 7.9s4.1 3.9 6.9 3.9l432 0c2.8 0 5.4-1.5 6.9-3.9s1.5-5.4 .2-7.9l-216-400c-1.4-2.6-4.1-4.2-7-4.2zm0 368a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm0-224c13.6 0 24.3 11.6 23.4 25.1l-7.4 104c-.6 8.4-7.6 14.9-16 14.9s-15.4-6.5-16-14.9l-7.4-104c-1-13.6 9.8-25.1 23.4-25.1z", fill: "currentColor" }, null, -1)])), 16);
}

script.render = render;

export { script as default };
//# sourceMappingURL=index.mjs.map
