<template>
	<router-link
		class="navigation__link-item"
		:to="to"
		@click="navigation.close()">
		<FontAwesomeIcon
			class="navigation__link-icon"
			:icon="`${icon}`" />
		<div class="navigation__link-title">{{ title }}</div>
	</router-link>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useNavigationStore } from '@/stores/Navigation'

defineProps<{
	to: RouteLocationRaw
	icon: string
	title: string
}>()

const navigation = useNavigationStore()
</script>

<style scoped lang="scss">
.navigation__link-item {
	display: flex;
	align-items: center;
	padding: 10px 12px;
	gap: 12px;
	color: var(--p-text-color);
	text-decoration: none;
	font-size: 16px;
	border-radius: 8px;
	margin: 6px 8px;
	position: relative;

	&:hover {
		background-color: var(--p-surface-100);

		@media (prefers-color-scheme: dark) {
			background-color: var(--p-surface-900);
		}
	}

	&.router-link-active {
		background-color: var(--p-surface-100);
		box-shadow: inset 3px 0 0 0 var(--p-primary-500);

		@media (prefers-color-scheme: dark) {
			background-color: var(--p-surface-900);
		}
	}

	.navigation__link-title {
		flex: 1;
	}

	.navigation__link-icon {
		font-size: 22px;
		color: var(--p-primary-500);
		width: 32px;
		display: flex;
		justify-content: center;

		@media (prefers-color-scheme: dark) {
			color: #ffffff;
		}
	}
}
</style>
