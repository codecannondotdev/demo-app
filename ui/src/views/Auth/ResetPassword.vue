<template>
	<div class="reset-password">
		<Card class="reset-password__card">
			<template #title>Reset Password</template>
			<template #content>
				<p>Enter new password to reset it</p>
				<form @submit.prevent="resetPassword()">
					<FormInput
						label="Password"
						:error-message="formErrors?.password?.[0]">
						<InputText
							v-model="form.password"
							class="reset-password__input"
							type="password"
							@keyup.enter="resetPassword()" />
					</FormInput>
					<FormInput
						label="Password Confirmation"
						:error-message="formErrors?.password_confirmation?.[0]">
						<InputText
							v-model="form.password_confirmation"
							class="reset-password__input"
							type="password"
							@keyup.enter="resetPassword()" />
					</FormInput>
					<Button
						label="Request password reset"
						type="submit"
						:loading />
					<Divider />
					<Button
						outlined
						label="Login"
						:disabled="loading"
						@click="router.push({ name: 'login' })" />
				</form>
			</template>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useAuthStore } from '@/stores/Auth'
import type { ResetPasswordParams } from '@/helpers/api/AuthApi'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import Divider from 'primevue/divider'
import FormInput from '@/components/FormInput.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)
const toast = useToast()
const form = ref<ResetPasswordParams>({
	token: '',
	email: '',
	password: '',
	password_confirmation: '',
})
const formErrors = ref<{
	email?: string[]
	token?: string[]
	password?: string[]
	password_confirmation?: string[]
} | null>(null)

async function resetPassword() {
	formErrors.value = null
	loading.value = true
	try {
		await auth.resetPassword(form.value)
		toast.add({
			severity: 'success',
			summary: 'Password reset',
			detail: 'Password reset successfully',
			life: 3000,
		})
		await auth.getUser()
		router.push({ name: 'root' })
	} catch (error: any) {
		if (error?.response?.status === 422 && error.response.data.errors) {
			formErrors.value = error.response.data.errors
		} else if (error?.response?.status === 422 && error.response.data.message) {
			formErrors.value = { password: [error.response.data.message] }
		} else {
			throw error
		}
	} finally {
		loading.value = false
	}
}

onBeforeMount(() => {
	form.value.token = route.query.token as string
	form.value.email = route.query.email as string
})
</script>

<style scoped lang="scss">
.reset-password {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;

	.reset-password__card {
		width: 500px;

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
