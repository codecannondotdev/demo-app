import BaseIcon from '@primevue/icons/baseicon';
import { createElementBlock, openBlock, mergeProps, createElementVNode } from 'vue';

var script = {
  name: 'SearchPlusIcon',
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
  }, _ctx.pti()), _toConsumableArray(_cache[0] || (_cache[0] = [createElementVNode("path", { d: "M208 32a176 176 0 1 1 0 352 176 176 0 1 1 0-352zm0 384c51.7 0 99-18.8 135.3-50L484.7 507.3c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L366 343.3C397.2 307 416 259.7 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208 93.1 416 208 416zM192 280c0 8.8 7.2 16 16 16s16-7.2 16-16l0-56 56 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-56 0 0-56c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 56-56 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l56 0 0 56z", fill: "currentColor" }, null, -1)])), 16);
}

script.render = render;

export { script as default };
//# sourceMappingURL=index.mjs.map
