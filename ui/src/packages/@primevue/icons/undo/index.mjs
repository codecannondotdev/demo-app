import BaseIcon from '@primevue/icons/baseicon';
import { createElementBlock, openBlock, mergeProps, createElementVNode } from 'vue';

var script = {
  name: 'UndoIcon',
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
  }, _ctx.pti()), _toConsumableArray(_cache[0] || (_cache[0] = [createElementVNode("path", { d: "M16 0c8.8 0 16 7.2 16 16l0 103.8 37-39.1C117.6 29.2 185.2 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-98.3 0-183.6-55.4-226.5-136.5-4.1-7.8-1.1-17.5 6.7-21.6s17.5-1.1 21.6 6.7C95.4 431.6 170.1 480 256 480 379.7 480 480 379.7 480 256S379.7 32 256 32c-62 0-121.2 25.5-163.8 70.6L53.1 144 160 144c8.8 0 16 7.2 16 16s-7.2 16-16 16L16 176c-8.8 0-16-7.2-16-16L0 16C0 7.2 7.2 0 16 0z", fill: "currentColor" }, null, -1)])), 16);
}

script.render = render;

export { script as default };
//# sourceMappingURL=index.mjs.map
