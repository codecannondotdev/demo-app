<template>
	<div class="verify-email">
		<Card class="verify-email__card">
			<template #title>Verify Email</template>
			<template #content>
				<p>Please verify your email to continue</p>
				<Button
					:loading
					label="Resend Email"
					@click="resendEmail()" />
				<Divider />
				<Button
					:disabled="loading"
					outlined
					label="Logout"
					@click="router.push({ name: 'logout' })" />
			</template>
		</Card>
	</div>
</template>

<script setup lang="ts">
import AuthApi from '@/helpers/api/AuthApi'
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

async function resendEmail() {
	loading.value = true
	try {
		await new AuthApi().resendEmailVerification()
	} finally {
		loading.value = false
	}
}
</script>

<style scoped lang="scss">
.verify-email {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;

	.verify-email__card {
		width: 500px;
		overflow: hidden;

		&:deep(.p-card-content) {
			display: flex;
			flex-direction: column;

			p {
				margin-bottom: 16px;
			}
		}
	}
}
</style>
