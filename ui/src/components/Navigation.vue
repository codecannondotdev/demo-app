<template>
	<div
		class="navigation"
		:class="{ 'navigation--expanded': locked }"
		@mouseover="isSidebarOpen = true"
		@mouseleave="isSidebarOpen = false">
		<div class="navigation__header">
			<img
				class="navigation__logo"
				src="@/assets/logo.png"
				alt="logo" />
			<Button
				v-tooltip.bottom="locked ? 'Unlock sidebar' : 'Lock sidebar'"
				severity="secondary"
				:icon="lockIcon"
				text
				@click="toggleLocked" />
		</div>
		<div class="navigation__links-container">
			<!-- GENERATOR(LINK) -->
		</div>
		<div class="navigation__links-container navigation__links-container--bottom">
			<router-link
				class="navigation__link-item"
				:to="{ name: 'clear-data' }">
				<i class="navigation__link-icon far fa-database"></i>
				<div class="navigation__link-title">Clear Data</div>
			</router-link>
		</div>
		<div
			class="navigation__footer"
			:class="{ 'navigation__footer--active': currentRouteName === 'account-details' }"
			@click="router.push({ name: 'account-details' })">
			<Avatar
				:label="initials"
				class="navigation__avatar" />
			<span class="navigation__email">{{ auth.user!.email }}</span>
			<Button
				class="navigation__logout-button"
				severity="secondary"
				icon="fat fa-arrow-right-from-bracket"
				text
				@click.stop="router.push({ name: 'logout' })" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const currentRouteName = computed(() => router.currentRoute.value.name)

const locked = ref(
	localStorage.getItem('sidebarLocked') ? localStorage.getItem('sidebarLocked') === 'true' : true,
)
const isSidebarOpen = ref(false)

const initials = computed(
	() => auth.user!.email[0].toUpperCase() + auth.user!.email[1].toUpperCase(),
)
const lockIcon = computed(() => {
	if (locked.value) {
		return 'fal fa-lock'
	} else {
		return 'fal fa-lock-open'
	}
})

function toggleLocked() {
	locked.value = !locked.value
	localStorage.setItem('sidebarLocked', locked.value.toString())
}
</script>

<style scoped lang="scss">
.navigation {
	border-right: 1px solid var(--p-surface-200);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	width: 52px;
	transition: width 0.3s;
	background-color: var(--p-surface-0);

	@media (prefers-color-scheme: dark) {
		border-right-color: var(--p-surface-900);
		background-color: var(--p-surface-950);
	}

	&.navigation--expanded,
	&:hover {
		width: 255px;

		.navigation__header {
			.navigation__logo {
				max-width: 88.83px;
			}
		}
	}

	.navigation__header {
		display: flex;
		align-items: center;
		padding: 10px;
		gap: 10px;
		border-bottom: 1px solid var(--p-surface-200);
		width: 255px;
		height: 64px;
		text-overflow: ellipsis;
		justify-content: space-between;

		@media (prefers-color-scheme: dark) {
			border-bottom-color: var(--p-surface-950);
		}

		.navigation__logo {
			max-width: 32px;
			transition: max-width 0.3s;
			flex-basis: content;
			max-height: 100%;
		}
	}

	.navigation__footer {
		display: flex;
		align-items: center;
		padding: 10px;
		gap: 10px;
		border-top: 1px solid var(--p-surface-200);
		width: 255px;
		height: 64px;
		text-overflow: ellipsis;

		&:has(:not(.navigation__logout-button:hover)):hover,
		&--active {
			background-color: var(--p-surface-100);
			cursor: pointer;

			@media (prefers-color-scheme: dark) {
				background-color: var(--p-surface-900);
			}
		}

		@media (prefers-color-scheme: dark) {
			border-top-color: var(--p-surface-950);
		}

		.navigation__email {
			flex: 1;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.navigation__avatar {
			min-width: 30px;
		}
	}

	.navigation__links-container {
		width: 255px;
		flex: 1;
		overflow: auto;

		&--bottom {
			flex: unset;
		}

		.navigation__link-item {
			display: flex;
			align-items: center;
			padding: 10px;
			gap: 10px;
			color: var(--p-text-color);
			text-decoration: none;

			&:hover {
				background-color: var(--p-surface-100);

				@media (prefers-color-scheme: dark) {
					background-color: var(--p-surface-900);
				}
			}

			&.router-link-active {
				background-color: var(--p-surface-100);

				@media (prefers-color-scheme: dark) {
					background-color: var(--p-surface-900);
				}
			}

			.navigation__link-title {
				flex: 1;
			}

			.navigation__link-icon {
				font-size: 22px;
				color: var(--p-surface-500);
				width: 32px;
				display: flex;
				justify-content: center;

				@media (prefers-color-scheme: dark) {
					color: var(--p-surface-400);
				}
			}
		}
	}

	.navigation__logo-container {
		padding: 8px;
	}
}
</style>
