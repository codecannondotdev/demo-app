<template>
	<div class="register">
		<Card class="register__card">
			<template #title>Register</template>
			<template #content>
				<form @submit.prevent="submit()">
					<FormInput
						label="Email"
						:error-message="formErrors?.email?.[0]">
						<InputText
							v-model="form.email"
							@keyup.enter="submit" />
					</FormInput>
					<FormInput
						label="Password"
						:error-message="formErrors?.password?.[0]">
						<InputText
							v-model="form.password"
							type="password"
							@keyup.enter="submit" />
					</FormInput>
					<FormInput
						label="Password Confirmation"
						:error-message="formErrors?.password_confirmation?.[0]">
						<InputText
							v-model="form.password_confirmation"
							type="password"
							@keyup.enter="submit" />
					</FormInput>
					<Button
						class="register__register-button"
						label="Register"
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
import { ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Divider from 'primevue/divider'
import FormInput from '@/components/FormInput.vue'

const form = ref({
	email: '',
	password: '',
	password_confirmation: '',
})
const formErrors = ref<{
	email?: string[]
	password?: string[]
	password_confirmation?: string[]
} | null>(null)
const loading = ref(false)

const router = useRouter()
const auth = useAuthStore()

async function submit() {
	loading.value = true
	try {
		await auth.register(form.value)
		await auth.getUser()
		router.push('/')
	} catch (error: any) {
		if (error.response?.status === 422) {
			formErrors.value = error.response?.data?.errors
		}
	} finally {
		loading.value = false
	}
}
</script>

<style scoped lang="scss">
.register {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;

	.register__card {
		width: 500px;
		overflow: hidden;

		&:deep(.p-card-content) {
			form {
				gap: 10px;
				display: flex;
				flex-direction: column;

				.register__register-button {
					margin-top: 16px;
				}
			}
		}
	}
}
</style>
