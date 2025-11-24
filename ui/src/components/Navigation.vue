<template>
	<div
		class="navigation"
		:class="{ 'navigation--overlay-open': navigation.overlayOpen }">
		<div class="navigation__panel">
			<div class="navigation__header">
				<img
					class="navigation__logo"
					src="@/assets/logo.png"
					alt="logo" />
			</div>
			<div class="navigation__links-container">
				<!-- GENERATOR(LINK) -->
			</div>
			<div class="navigation__links-container navigation__links-container--bottom">
				<NavigationLink
					:to="{ name: 'clear-data' }"
					icon="fal fa-database"
					title="Clear Data" />
			</div>
			<div
				class="navigation__footer"
				:class="{ 'navigation__footer--active': currentRouteName === 'account-details' }"
				@click="(router.push({ name: 'account-details' }), navigation.close())">
				<Avatar
					:label="initials"
					class="navigation__avatar" />
				<span class="navigation__email">{{ auth.user!.email }}</span>
				<Button
					class="navigation__logout-button"
					severity="secondary"
					icon="fat fa-arrow-right-from-bracket"
					text
					@click.stop="logout" />
			</div>
		</div>
		<Transition name="nav-scrim">
			<div
				v-if="navigation.overlayOpen"
				class="navigation__scrim"
				@click="navigation.close()"></div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import NavigationLink from '@/components/NavigationLink.vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '@/stores/Navigation'

const auth = useAuthStore()
const router = useRouter()
const navigation = useNavigationStore()

const initials = computed(
	() => auth.user!.email[0]!.toUpperCase() + auth.user!.email[1]!.toUpperCase(),
)
const currentRouteName = computed(() => router.currentRoute.value.name)
function logout() {
	router.push({ name: 'logout' })
}
</script>

<style scoped lang="scss">
.navigation {
	border-right: 1px solid var(--p-surface-200);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	width: 260px;
	background-color: var(--p-surface-0);
	position: relative;
	z-index: 400;

	@media (prefers-color-scheme: dark) {
		border-right-color: var(--p-surface-900);
		background-color: var(--p-surface-950);
	}

	.navigation__panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		z-index: 4001;
	}

	.navigation__header {
		display: flex;
		align-items: center;
		padding: 0 24px;
		gap: 10px;
		border-bottom: 1px solid var(--p-surface-200);
		height: 64px;
		justify-content: center;

		@media (prefers-color-scheme: dark) {
			border-bottom-color: var(--p-surface-900);
		}

		.navigation__logo {
			max-height: 40px;
			width: auto;
		}
	}

	.navigation__footer {
		display: flex;
		align-items: center;
		padding: 10px;
		gap: 10px;
		border-top: 1px solid var(--p-surface-200);
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
			font-size: 12px;
		}

		.navigation__avatar {
			min-width: 30px;
		}
	}

	.navigation__links-container {
		flex: 1;
		overflow: auto;
		padding: 2px 0;

		&--bottom {
			flex: unset;
		}
	}

	@media only screen and (max-width: 1500px) {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100dvh;
		border-right: none;
		background: transparent;
		pointer-events: none;
		z-index: 4000;

		.navigation__panel {
			position: absolute;
			left: 0;
			top: 0;
			width: 260px;
			height: 100%;
			background: var(--p-surface-0);
			border-right: 1px solid var(--p-surface-200);
			box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
			transform: translateX(-100%);
			transition: transform 0.25s ease;
			will-change: transform;
			z-index: 4002;

			@media (prefers-color-scheme: dark) {
				background: var(--p-surface-950);
				border-right-color: var(--p-surface-900);
			}
		}

		&.navigation--overlay-open {
			pointer-events: auto;

			.navigation__panel {
				transform: translateX(0);
			}
		}

		.navigation__scrim {
			position: fixed;
			inset: 0;
			background: rgba(0, 0, 0, 0.3);
			z-index: 4001;
			pointer-events: auto;
			opacity: 1;
			backdrop-filter: blur(4px);
		}

		.nav-scrim-enter-from,
		.nav-scrim-leave-to {
			opacity: 0;
			backdrop-filter: blur(0px);
		}
		.nav-scrim-enter-active,
		.nav-scrim-leave-active {
			transition:
				opacity 0.2s ease,
				backdrop-filter 0.25s ease,
				-webkit-backdrop-filter 0.25s ease;
			will-change: opacity, backdrop-filter;
		}
		.nav-scrim-enter-to,
		.nav-scrim-leave-from {
			opacity: 1;
			backdrop-filter: blur(4px);
		}
	}
}
</style>
