<template>
	<div class="login">
		<Card class="login__card">
			<template #title>Sign in</template>
			<template #content>
				<form @submit.prevent="submit()">
					<FormInput
						label="Email"
						:error-message="formErrors?.email?.[0]">
						<template #prepend-label>
							<p class="login__input-container-login-tip">
								Login with pre-populated credentials. Your credentials won't work here as this is a
								test deployment.
							</p>
						</template>
						<InputText
							v-model="form.email"
							class="login__input" />
					</FormInput>
					<FormInput
						label="Password"
						:error-message="formErrors?.password?.[0]">
						<InputText
							v-model="form.password"
							class="login__input"
							type="password" />
					</FormInput>
					<div class="login__remember-forgot-container">
						<div class="login__remember-container">
							<Checkbox
								v-model="form.remember"
								input-id="remember"
								binary />
							<label
								for="remember"
								class="login__remember-label"
								>Remember me</label
							>
						</div>
						<router-link
							class="login__forgot-password"
							:to="{ name: 'forgot-password' }"
							>Forgot password?
						</router-link>
					</div>
					<Button
						class="login__login-button"
						label="Login"
						type="submit"
						:loading />
					<Button
						outlined
						label="Register"
						:disabled="loading"
						@click="router.push({ name: 'register' })" />
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
import Checkbox from 'primevue/checkbox'
import FormInput from '@/components/FormInput.vue'

const form = ref({
	email: 'test@codecannon.dev',
	password: 'password',
	remember: false,
})
const formErrors = ref<{
	email?: string[]
	password?: string[]
} | null>(null)
const loading = ref(false)

const router = useRouter()
const auth = useAuthStore()

async function submit() {
	formErrors.value = null
	loading.value = true
	try {
		await auth.login(form.value)
	} catch (error: any) {
		if (error.response?.status === 422) {
			formErrors.value = error.response?.data?.errors
		}
		throw error
	} finally {
		loading.value = false
	}
	router.push('/')
}
</script>

<style scoped lang="scss">
.login {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;

	.login__card {
		width: 500px;
		overflow: hidden;

		form {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;

			& > * {
				width: 100%;
			}

			.login__input-container-login-tip {
				font-size: 10px;
				color: var(--p-text-muted-color);
				font-style: italic;
				margin: 0;
			}

			.login__remember-forgot-container {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				margin-bottom: 16px;

				.login__remember-container {
					display: flex;
					align-items: center;
					gap: 8px;
					white-space: nowrap;

					.login__remember-label {
						cursor: pointer;
						font-size: 14px;
					}
				}

				.login__forgot-password {
					font-size: 14px;
					color: var(--primary-color);
					text-decoration: none;
				}
			}
		}
	}
}
</style>
