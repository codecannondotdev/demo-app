<template>
	<div class="forgot-password">
		<Card class="forgot-password__card">
			<template #title>Forgot Password</template>
			<template #content>
				<form
					v-if="!emailSent"
					@submit.prevent="requestPasswordReset()">
					<p>Enter your email and we'll send you a password reset link</p>
					<FormInput
						label="Email"
						:error-message="formErrors?.email?.[0]">
						<InputText
							v-model="form.email"
							class="forgot-password__input" />
					</FormInput>
					<Button
						label="Request password reset"
						type="submit"
						:loading />
				</form>
				<p v-else>
					An email has been sent to your email address with a password reset link. Please check your
					email.
				</p>
				<Divider />
				<Button
					:disabled="loading"
					outlined
					label="Login"
					@click="router.push({ name: 'login' })" />
			</template>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useAuthStore } from '@/stores/Auth'
import type { RequestPasswordResetParams } from '@/helpers/api/AuthApi'
import InputText from 'primevue/inputtext'
import Divider from 'primevue/divider'
import FormInput from '@/components/FormInput.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const form = ref<RequestPasswordResetParams>({
	email: '',
})
const formErrors = ref<{ email?: string[] } | null>(null)
const emailSent = ref(false)

async function requestPasswordReset() {
	formErrors.value = null
	loading.value = true
	try {
		await auth.requestPasswordReset(form.value)
		emailSent.value = true
	} catch (error: any) {
		if (error?.response?.status === 422 && error.response.data.errors) {
			formErrors.value = error.response.data.errors
		} else {
			throw error
		}
	} finally {
		loading.value = false
	}
}
</script>

<style scoped lang="scss">
.forgot-password {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;

	.forgot-password__card {
		width: 500px;
		overflow: hidden;

		&:deep(.p-card-content) {
			display: flex;
			flex-direction: column;
			p {
				margin-bottom: 16px;
			}
		}

		form {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;

			& > * {
				width: 100%;
			}
		}
	}
}
</style>
