<template>
	<FormContainer
		class="form"
		title="User Info">
		<form @submit.prevent="submit">
			<FormInput
				label="Name"
				:required="true"
				:error-message="formErrors.name">
				<InputText v-model="formData.name" />
			</FormInput>
			<FormInput
				label="Email"
				:required="true"
				:error-message="formErrors.email">
				<InputText v-model="formData.email" />
			</FormInput>
			<div class="form__footer-container">
				<Button
					class="form__change-password-button"
					icon="fal fa-key"
					:loading="loading"
					label="Change Password"
					severity="secondary"
					@click="changePassword"
					@submit.stop />
				<Button
					class="form__logout-button"
					icon="fal fa-save"
					:loading="loading"
					label="Update"
					type="submit" />
			</div>
		</form>
	</FormContainer>
</template>

<script setup lang="ts">
import UsersApi from '@/models/User/Api'
import type { User } from '@/models/User/Model'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useForm } from '@/helpers/form'
import FormInput from '@/components/FormInput.vue'
import FormContainer from '@/components/FormContainer.vue'
import { useAuthStore } from '@/stores/Auth'
import { useToast } from 'primevue/usetoast'

type FormData = {
	email: string
	name: string
}

const emit = defineEmits(['start-loading', 'stop-loading', 'updated'])

const props = withDefaults(
	defineProps<{
		id?: User['id']
	}>(),
	{
		id: undefined,
	},
)

const authStore = useAuthStore()
const toast = useToast()

const { formData, loading, formErrors, submit } = useForm({
	api: () => new UsersApi(),
	defaultData: () =>
		({
			email: '',
			name: '',
		}) satisfies FormData as FormData,
	isEdit: () => true,
	id: () => props.id,
	onStartLoading: () => emit('start-loading'),
	onStopLoading: () => emit('stop-loading'),
	onUpdated: () => {
		emit('updated')
		authStore.getUser()
	},
})

async function changePassword() {
	loading.value = true
	try {
		await authStore.requestPasswordReset({ email: authStore.user!.email })
		toast.add({
			severity: 'info',
			summary: 'Password reset requested',
			detail: `And email with password reset instructions has been sent to ${authStore.user!.email}`,
			life: 5000,
		})
	} finally {
		loading.value = false
	}
}
</script>

<style scoped lang="scss">
.form {
	max-width: unset;

	form {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;

		& > * {
			width: 100%;
		}

		.form__footer-container {
			display: flex;
			align-items: center;
			gap: 10px;

			.form__change-password-button,
			.form__logout-button {
				width: 100%;
			}
		}

		&--edit {
			.form__footer-container {
				justify-content: space-between;
			}
		}
	}
}
</style>
