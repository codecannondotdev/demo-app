<template>
	<div
		v-if="authStore.userReturned"
		class="app">
		<Navigation
			v-if="!route.meta.noNavigation && authStore.user"
			permanent />
		<main>
			<Suspense>
				<RouterView />
			</Suspense>
		</main>
		<Toast position="bottom-right" />
		<ConfirmDialog></ConfirmDialog>
	</div>
	<ProgressSpinner
		v-else
		class="app-loader" />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navigation from '@/components/Navigation.vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useAuth } from './composables/useAuth'
import ProgressSpinner from 'primevue/progressspinner'

const { authStore } = useAuth()
const route = useRoute()
</script>

<style scoped lang="scss">
.app {
	display: flex;
	flex-direction: row;
	height: 100vh;
	width: 100%;
	justify-content: center;
	max-height: 100vh;
	overflow: auto;

	main {
		flex: 1;
		max-height: 100vh;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}

.app-loader {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
