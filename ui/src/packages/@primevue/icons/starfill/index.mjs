import BaseIcon from '@primevue/icons/baseicon'
import { createElementBlock, openBlock, mergeProps, createElementVNode } from 'vue'

var script = {
	name: 'StarFillIcon',
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
					viewBox: '0 0 576 512',
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
								d: 'M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z',
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
