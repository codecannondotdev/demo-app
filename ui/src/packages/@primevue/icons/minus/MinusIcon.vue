<template>
    <svg width="14" height="14" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="pti()">
		<path d="M0 256c0-8.8 7.2-16 16-16l416 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L16 272c-8.8 0-16-7.2-16-16z" fill="currentColor" />
	</svg>
</template>
<script>
import BaseIcon from '@primevue/icons/baseicon';

export default {
    name: 'MinusIcon',
    extends: BaseIcon
};
</script>
