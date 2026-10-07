import BaseIcon from '@primevue/icons/baseicon';
import { createElementBlock, openBlock, mergeProps, createElementVNode } from 'vue';

var script = {
  name: 'TrashIcon',
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
    viewBox: "0 0 448 512",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, _ctx.pti()), _toConsumableArray(_cache[0] || (_cache[0] = [createElementVNode("path", { d: "M160.5 27.4c2-6.8 8.3-11.4 15.3-11.4l96.4 0c7.1 0 13.3 4.6 15.3 11.4l11 36.6-149 0 11-36.6zM116.1 64L16 64C7.2 64 0 71.2 0 80S7.2 96 16 96l416 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-100.1 0-13.7-45.8C312.1-2.1 293.4-16 272.2-16l-96.4 0c-21.2 0-39.9 13.9-46 34.2L116.1 64zM28.7 144L51.6 452.7c2.5 33.4 30.3 59.3 63.8 59.3l217.1 0c33.5 0 61.3-25.9 63.8-59.3l22.9-308.7-32.1 0-22.7 306.4c-1.2 16.7-15.2 29.6-31.9 29.6l-217.1 0c-16.8 0-30.7-12.9-31.9-29.6L60.8 144 28.7 144z", fill: "currentColor" }, null, -1)])), 16);
}

script.render = render;

export { script as default };
//# sourceMappingURL=index.mjs.map
