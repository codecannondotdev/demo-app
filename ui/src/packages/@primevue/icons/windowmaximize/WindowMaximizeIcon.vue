<template>
    <svg width="14" height="14" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="pti()">
		<path d="M64 96c-17.7 0-32 14.3-32 32l0 64 448 0 0-64c0-17.7-14.3-32-32-32L64 96zM32 224l0 160c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32l0-160-448 0zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" fill="currentColor" />
	</svg>
</template>

<script>
import BaseIcon from '@primevue/icons/baseicon';

export default {
    name: 'WindowMaximizeIcon',
    extends: BaseIcon
};
</script>
