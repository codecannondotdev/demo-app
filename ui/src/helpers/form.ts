import { useConfirm } from 'primevue/useconfirm'
import { computed, onBeforeMount, onUnmounted, ref, toRaw, type Ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import type Api from './models/Api'
import type { Model, Plain, PropertyType } from './models/Model'

export function isFormDirty(original: Record<string, any>, current: Record<string, any>): boolean {
	for (const key in original) {
		if (original[key] !== current[key]) {
			return true
		}
	}
	return false
}

export interface FormOptions<
	FormApi extends Api<FormModel>,
	FormData extends Parameters<FormApi['store']>[0] | Parameters<FormApi['update']>[1],
	FormModel extends Model = FormApi extends Api<infer M> ? M : never,
> {
	redirectProtection?: () => boolean | undefined
	defaultData: () => FormData
	api: () => FormApi
	forceValues?: () => Record<string, any> | undefined
	populateForm?: (data: Partial<FormData> | Plain<FormModel>) => void
	attachTo?: () =>
		| Record<string, { method: 'associate' | 'syncWithoutDetaching'; id: string | number }>
		| undefined
	id?: Ref<PropertyType<FormModel, 'id'> | undefined | null>
	onStartLoading?: () => void
	onStopLoading?: () => void
	onSubmit?: () => void
	onCreated?: (entity: Plain<FormModel>) => void
	onUpdated?: () => void
	onDeleted?: () => void
	formatOnCreate?: (data: FormData) => Parameters<FormApi['store']>[0]
	formatOnUpdate?: (data: FormData) => Parameters<FormApi['update']>[1]
}

export function useForm<
	FormApi extends Api<FormModel>,
	FormData extends Parameters<FormApi['store']>[0] | Parameters<FormApi['update']>[1],
	FormModel extends Model = FormApi extends Api<infer M> ? M : never,
>({
	redirectProtection = () => true,
	defaultData,
	api,
	id,
	forceValues,
	populateForm,
	attachTo,
	onStartLoading,
	onStopLoading,
	onSubmit,
	onCreated,
	onUpdated,
	onDeleted,
	formatOnCreate,
	formatOnUpdate,
}: FormOptions<FormApi, FormData, FormModel>): {
	formData: Ref<FormData>
	loading: Ref<boolean>
	formErrors: Ref<Record<string, string>>
	reset: () => void
	submit: () => Promise<void>
	remove: () => Promise<void>
	isDirty: Ref<boolean>
	isEdit: Ref<boolean>
} {
	const confirm = useConfirm()

	const formData = ref(defaultData()) as Ref<FormData>
	const loading = ref(false)
	const originalFormData = ref(defaultData()) as Ref<FormData>
	const formErrors = ref<Record<string, string>>({})
	const isDirty = computed(() => {
		return isFormDirty(originalFormData.value, formData.value)
	})
	const isEdit = computed(() => {
		return !!id?.value
	})
	let runPopulateForm

	if (!populateForm) {
		runPopulateForm = (data: Partial<FormData> | Plain<FormModel>) => {
			const newForm = structuredClone(toRaw(formData.value))
			Object.entries(data).forEach(([key, value]) => {
				if (!Object.prototype.hasOwnProperty.call(toRaw(formData.value), key)) return
				newForm[key as keyof FormData] = value
			})
			formData.value = newForm
			originalFormData.value = structuredClone(newForm)
		}
	} else {
		runPopulateForm = (data: Partial<FormData> | Plain<FormModel>) => {
			populateForm(data)
			originalFormData.value = structuredClone(toRaw(formData.value))
		}
	}

	const redirectProtectionEnabled = computed(() => {
		return !!redirectProtection()
	})

	const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
		if (!redirectProtectionEnabled.value) return

		if (isDirty.value) {
			event.preventDefault()
		}
	}

	onBeforeMount(() => {
		if (redirectProtection()) {
			addEventListener('beforeunload', beforeUnloadHandler)
		}

		reset()
	})

	onUnmounted(() => {
		removeEventListener('beforeunload', beforeUnloadHandler)
	})

	onBeforeRouteUpdate((_to, _from, next) => {
		beforeRedirect(next)
	})

	function beforeRedirect(next: () => void) {
		if (!redirectProtectionEnabled.value) return

		if (!isDirty.value) return next()
		confirm.require({
			message: `You have unsaved changes. Are you sure you want to leave?`,
			header: 'Danger Zone',
			icon: 'fas fa-exclamation-triangle',
			rejectLabel: 'Cancel',
			rejectProps: {
				label: 'Cancel',
				severity: 'secondary',
				outlined: true,
			},
			acceptProps: {
				label: 'Leave',
				severity: 'danger',
			},
			accept: async () => {
				next()
			},
			reject: () => {},
		})
	}

	async function reset() {
		if (isEdit.value) {
			loading.value = true
			onStartLoading?.()
			runPopulateForm!(await getDetails())
		} else {
			runPopulateForm!(defaultData())
		}
		formErrors.value = {}
	}

	async function getDetails() {
		if (!id || !id.value) {
			throw new Error(
				'Missing id in getDetails. This function should only be called if the id is provided to the composable. This should never happen.',
			)
		}

		loading.value = true
		onStartLoading?.()
		try {
			const res = await api().show(id.value)
			return res.data
		} finally {
			loading.value = false
			onStopLoading?.()
		}
	}

	async function create() {
		formErrors.value = {}
		loading.value = true
		onStartLoading?.()
		try {
			let params = structuredClone(toRaw(formData.value))
			params = { ...params, ...(forceValues?.() ?? {}) }
			const formatted = formatOnCreate ? formatOnCreate(params) : params
			const res = await api().store(formatted)
			await attachToAll(res.data.id)
			originalFormData.value = structuredClone(toRaw(formData.value))
			onCreated?.(res.data)
			return res.data
		} catch (error: any) {
			if (error.response?.status === 422 && error.response?.data?.errors) {
				Object.entries(error.response?.data?.errors).forEach(([key, value]) => {
					formErrors.value[key] = (value as string[])[0]!
				})
			}
			throw error
		} finally {
			loading.value = false
			onStopLoading?.()
		}
	}

	async function update() {
		formErrors.value = {}
		loading.value = true
		onStartLoading?.()
		try {
			let params = structuredClone(toRaw(formData.value))
			params = { ...params, ...(forceValues?.() ?? {}) }
			const formatted = formatOnUpdate ? formatOnUpdate(params) : params
			const res = await api().update(id?.value!, formatted)
			await attachToAll(res.data.id)
			originalFormData.value = structuredClone(toRaw(formData.value))
			onUpdated?.()
			return res.data
		} catch (error: any) {
			if (error.response?.status === 422 && error.response?.data?.errors) {
				Object.entries(error.response?.data?.errors).forEach(([key, value]) => {
					formErrors.value[key] = (value as string[])[0]!
				})
			}
			throw error
		} finally {
			loading.value = false
			onStopLoading?.()
		}
	}

	async function attachToAll(id: PropertyType<FormModel, 'id'>) {
		if (!attachTo?.()) return
		for (const [key, value] of Object.entries(attachTo()!)) {
			loading.value = true
			onStartLoading?.()
			try {
				await api().updateRelation(id!, key, {
					method: value.method,
					params: [value.id],
				})
			} finally {
				loading.value = false
				onStopLoading?.()
			}
		}
	}

	async function submit() {
		if (isEdit.value && id?.value) {
			try {
				await update()
				onSubmit?.()
			} catch (error: any) {
				console.error(error)
			}
		} else {
			try {
				await create()
				onSubmit?.()
			} catch (error: any) {
				console.error(error)
			}
		}
	}

	async function remove() {
		loading.value = true
		onStartLoading?.()
		try {
			confirm.require({
				message: `Are you sure you want to delete the this item?`,
				header: 'Danger Zone',
				icon: 'fas fa-exclamation-triangle',
				rejectLabel: 'Cancel',
				rejectProps: {
					label: 'Cancel',
					severity: 'secondary',
					outlined: true,
				},
				acceptProps: {
					label: 'Delete',
					severity: 'danger',
				},
				accept: async () => {
					await api().destroy(id?.value!)
					onDeleted?.()
				},
				reject: () => {},
			})
		} finally {
			loading.value = false
			onStopLoading?.()
		}
	}

	return {
		formData,
		loading,
		formErrors,
		reset,
		submit,
		remove,
		isDirty,
		isEdit,
	}
}
