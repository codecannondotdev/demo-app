<template>
    <svg width="14" height="14" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="pti()">
		<path d="M240 48c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 192-192 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0 0 192c0 8.8 7.2 16 16 16s16-7.2 16-16l0-192 192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-192 0 0-192z" fill="currentColor" />
	</svg>
</template>

<script>
import BaseIcon from '@primevue/icons/baseicon';

export default {
    name: 'PlusIcon',
    extends: BaseIcon
};
</script>
