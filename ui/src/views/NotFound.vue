<template>
	<div class="not-found">
		<h1>404</h1>
		<p>Oops... Page not found.</p>
		<Button
			icon="fal fa-home"
			label="Take me home"
			severity="secondary"
			variant="outlined"
			@click="router.replace('/')" />
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
</script>

<style lang="scss" scoped>
.not-found {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;

	h1 {
		font-size: 200px;
		font-weight: bold;
		margin: 0;
		line-height: 1;
	}

	p {
		font-size: 20px;
		line-height: 1;
		margin: 30px;
	}
}
</style>
