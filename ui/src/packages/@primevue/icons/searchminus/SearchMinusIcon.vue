<template>
    <svg width="14" height="14" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="pti()">
		<path d="M208 32a176 176 0 1 1 0 352 176 176 0 1 1 0-352zm0 384c51.7 0 99-18.8 135.3-50L484.7 507.3c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L366 343.3C397.2 307 416 259.7 416 208 416 93.1 322.9 0 208 0S0 93.1 0 208 93.1 416 208 416zM128 192c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0z" fill="currentColor" />
	</svg>
</template>

<script>
import BaseIcon from '@primevue/icons/baseicon';

export default {
    name: 'SearchMinusIcon',
    extends: BaseIcon
};
</script>
