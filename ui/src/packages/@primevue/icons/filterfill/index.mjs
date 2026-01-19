import BaseIcon from '@primevue/icons/baseicon'
import { createElementBlock, openBlock, mergeProps, createElementVNode } from 'vue'

var script = {
	name: 'FilterFillIcon',
	extends: BaseIcon,
}

function _toConsumableArray(r) {
	return (
		_arrayWithoutHoles(r) ||
		_iterableToArray(r) ||
		_unsupportedIterableToArray(r) ||
		_nonIterableSpread()
	)
}
function _nonIterableSpread() {
	throw new TypeError(
		'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
	)
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ('string' == typeof r) return _arrayLikeToArray(r, a)
		var t = {}.toString.call(r).slice(8, -1)
		return (
			'Object' === t && r.constructor && (t = r.constructor.name),
			'Map' === t || 'Set' === t
				? Array.from(r)
				: 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
					? _arrayLikeToArray(r, a)
					: void 0
		)
	}
}
function _iterableToArray(r) {
	if (('undefined' != typeof Symbol && null != r[Symbol.iterator]) || null != r['@@iterator'])
		return Array.from(r)
}
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r)
}
function _arrayLikeToArray(r, a) {
	;(null == a || a > r.length) && (a = r.length)
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]
	return n
}
function render(_ctx, _cache, $props, $setup, $data, $options) {
	return (
		openBlock(),
		createElementBlock(
			'svg',
			mergeProps(
				{
					width: '14',
					height: '14',
					viewBox: '0 0 512 512',
					xmlns: 'http://www.w3.org/2000/svg',
				},
				_ctx.pti(),
			),
			_toConsumableArray(
				_cache[0] ||
					(_cache[0] = [
						createElementVNode(
							'path',
							{
								d: 'M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z',
								fill: 'currentColor',
							},
							null,
							-1,
						),
					]),
			),
			16,
		)
	)
}

script.render = render

export { script as default }
//# sourceMappingURL=index.mjs.map
