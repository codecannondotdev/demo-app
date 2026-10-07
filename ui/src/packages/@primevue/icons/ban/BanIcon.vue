<template>
    <svg width="14" height="14" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="pti()">
		<path d="M402.7 425.3l-316-316c-34.1 39.3-54.7 90.6-54.7 146.7 0 123.7 100.3 224 224 224 56.1 0 107.4-20.6 146.7-54.7zm22.6-22.6c34.1-39.3 54.7-90.6 54.7-146.7 0-123.7-100.3-224-224-224-56.1 0-107.4 20.6-146.7 54.7l316 316zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z" fill="currentColor" />
	</svg>
</template>

<script>
import BaseIcon from '@primevue/icons/baseicon';

export default {
    name: 'BanIcon',
    extends: BaseIcon
};
</script>
