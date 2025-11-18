<template>
	<div class="header">
		<Button
			class="header__menu-button"
			icon="fal fa-bars"
			severity="secondary"
			@click="openNav" />
		<h2>{{ title }}</h2>
		<slot />
	</div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { useNavigationStore } from '@/stores/Navigation'

defineProps<{
	title: string
}>()

const navigation = useNavigationStore()

function openNav() {
	if (window.matchMedia('(max-width: 1500px)').matches) {
		navigation.open()
	}
}
</script>

<style scoped lang="scss">
.header {
	background: var(--p-surface-0);
	position: sticky;
	top: 0;
	z-index: 1000;
	border-left: 0;
	border-top: 0;
	border-right: 0;
	border-bottom: 1px solid var(--p-surface-200);
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 10px 16px;
	height: 64px;
	min-height: 64px;
	max-height: 64px;
	width: 100%;

	@media (prefers-color-scheme: dark) {
		background: var(--p-surface-950);
		border-bottom-color: var(--p-surface-900);
	}

	.header__menu-button {
		display: none;
	}

	@media (max-width: 1500px) {
		.header__menu-button {
			display: inline-flex;
		}
	}

	h2 {
		font-size: 22px;
		flex: 1;
	}
}
</style>
