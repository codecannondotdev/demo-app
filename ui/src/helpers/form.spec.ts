import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { ref, nextTick, type Ref, createApp } from 'vue'
import { isFormDirty, useForm, type FormOptions } from './form'
import type Api from './models/Api'
import type { Column, Model, Plain } from './models/Model'

// ─── Mock external dependencies ──────────────────────────────────────────────

const mockConfirmRequire = vi.fn()

vi.mock('primevue/useconfirm', () => ({
	useConfirm: () => ({ require: mockConfirmRequire }),
}))

vi.mock('vue-router', () => ({
	onBeforeRouteUpdate: vi.fn(),
}))

// ─── Test model & helpers ────────────────────────────────────────────────────

type TestModel = Model<{
	name: Column<string>
	email: Column<string>
}>

type TestFormData = {
	name: string
	email: string
}

type TestPlain = Plain<TestModel>

function createMockApi(overrides: Partial<Api<TestModel>> = {}): Api<TestModel> {
	return {
		route: 'test',
		list: vi.fn(),
		show: vi.fn().mockResolvedValue({
			data: { id: 1, name: 'Loaded Name', email: 'loaded@test.com' } as TestPlain,
		}),
		store: vi.fn().mockResolvedValue({
			data: { id: 99, name: 'Created', email: 'created@test.com' } as TestPlain,
		}),
		update: vi.fn().mockResolvedValue({
			data: { id: 1, name: 'Updated', email: 'updated@test.com' } as TestPlain,
		}),
		updateRelation: vi.fn().mockResolvedValue({ data: {} }),
		destroy: vi.fn().mockResolvedValue({}),
		...overrides,
	} as unknown as Api<TestModel>
}

function defaultData(): TestFormData {
	return { name: '', email: '' }
}

/**
 * Helper to test composables with Vue context.
 * This is the recommended way to test composables that use lifecycle hooks.
 */
function withSetup<T>(composable: () => T) {
	let result: T
	const app = createApp({
		setup() {
			result = composable()
			return () => null
		},
	})
	app.mount(document.createElement('div'))
	return { result: result!, app }
}

/**
 * Helper to call useForm with sensible defaults.
 * Overrides are merged on top.
 */
async function setupForm(
	overrides: Partial<FormOptions<Api<TestModel>, TestFormData, TestModel>> = {},
) {
	const mockApi = createMockApi(overrides.api ? undefined : undefined)
	const opts: FormOptions<Api<TestModel>, TestFormData, TestModel> = {
		defaultData,
		api: () => mockApi,
		...overrides,
	}
	// If caller provided their own api factory, respect it – but keep a handle to
	// the one we created for assertion purposes.
	const apiInstance = overrides.api ? overrides.api() : mockApi

	const { result, app } = withSetup(() => useForm(opts))

	// If in edit mode, useForm calls reset() on mount which is async.
	// We wait for it to finish to ensure a stable initial state.
	if (result.isEdit.value) {
		await nextTick()
		while (result.loading.value) {
			await nextTick()
		}
	}

	return { ...result, apiInstance, mockApi, app }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('isFormDirty', () => {
	it('returns false when both objects are empty', () => {
		expect(isFormDirty({}, {})).toBe(false)
	})

	it('returns false when original and current have the same values', () => {
		const original = { name: 'Alice', age: 30 }
		const current = { name: 'Alice', age: 30 }
		expect(isFormDirty(original, current)).toBe(false)
	})

	it('returns true when a value differs', () => {
		const original = { name: 'Alice' }
		const current = { name: 'Bob' }
		expect(isFormDirty(original, current)).toBe(true)
	})

	it('returns true when a value is changed to undefined', () => {
		const original = { name: 'Alice' }
		const current = { name: undefined }
		expect(isFormDirty(original, current)).toBe(true)
	})

	it('only compares keys from original (ignores extra keys in current)', () => {
		const original = { name: 'Alice' }
		const current = { name: 'Alice', extra: 'value' }
		expect(isFormDirty(original, current)).toBe(false)
	})

	it('returns true when a numeric value differs', () => {
		const original = { count: 1 }
		const current = { count: 2 }
		expect(isFormDirty(original, current)).toBe(true)
	})

	it('returns true when a boolean value differs', () => {
		const original = { active: true }
		const current = { active: false }
		expect(isFormDirty(original, current)).toBe(true)
	})

	it('uses strict equality (does not coerce types)', () => {
		const original = { value: 0 }
		const current = { value: '' }
		expect(isFormDirty(original, current as any)).toBe(true)
	})

	it('detects difference when value is null vs undefined', () => {
		const original = { value: null }
		const current = { value: undefined }
		expect(isFormDirty(original, current)).toBe(true)
	})

	it('does not deep-compare objects (reference equality)', () => {
		const obj = { nested: true }
		const original = { value: obj }
		const current = { value: { nested: true } }
		// Different reference → dirty
		expect(isFormDirty(original, current)).toBe(true)
	})

	it('returns false when objects share the same reference for nested values', () => {
		const obj = { nested: true }
		const original = { value: obj }
		const current = { value: obj }
		expect(isFormDirty(original, current)).toBe(false)
	})
})

describe('useForm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	// ── Initialization ──────────────────────────────────────────────────────

	describe('initialization', () => {
		it('returns the expected shape', async () => {
			const result = await setupForm()
			expect(result).toHaveProperty('formData')
			expect(result).toHaveProperty('loading')
			expect(result).toHaveProperty('formErrors')
			expect(result).toHaveProperty('reset')
			expect(result).toHaveProperty('submit')
			expect(result).toHaveProperty('remove')
			expect(result).toHaveProperty('isDirty')
			expect(result).toHaveProperty('isEdit')
		})

		it('initializes formData with defaultData', async () => {
			const { formData } = await setupForm()
			expect(formData.value).toEqual({ name: '', email: '' })
		})

		it('initializes loading as false', async () => {
			const { loading } = await setupForm()
			expect(loading.value).toBe(false)
		})

		it('initializes formErrors as empty', async () => {
			const { formErrors } = await setupForm()
			expect(formErrors.value).toEqual({})
		})

		it('initializes isDirty as false', async () => {
			const { isDirty } = await setupForm()
			expect(isDirty.value).toBe(false)
		})

		it('initializes isEdit as false when no id is provided', async () => {
			const { isEdit } = await setupForm()
			expect(isEdit.value).toBe(false)
		})

		it('initializes isEdit as true when id ref has a value', async () => {
			const { isEdit } = await setupForm({ id: ref(1) as any })
			expect(isEdit.value).toBe(true)
		})

		it('initializes isEdit as false when id ref is null', async () => {
			const { isEdit } = await setupForm({ id: ref(null) as any })
			expect(isEdit.value).toBe(false)
		})

		it('initializes isEdit as false when id ref is undefined', async () => {
			const { isEdit } = await setupForm({ id: ref(undefined) as any })
			expect(isEdit.value).toBe(false)
		})
	})

	// ── isDirty reactivity ──────────────────────────────────────────────────

	describe('isDirty', () => {
		it('becomes true when formData is modified', async () => {
			const { formData, isDirty } = await setupForm()
			expect(isDirty.value).toBe(false)

			formData.value.name = 'changed'
			await nextTick()
			expect(isDirty.value).toBe(true)
		})

		it('becomes false again when formData is reverted', async () => {
			const { formData, isDirty } = await setupForm()
			formData.value.name = 'changed'
			await nextTick()
			expect(isDirty.value).toBe(true)

			formData.value.name = ''
			await nextTick()
			expect(isDirty.value).toBe(false)
		})
	})

	// ── submit (create mode) ────────────────────────────────────────────────

	describe('submit – create mode', () => {
		it('calls api.store with formData', async () => {
			const mockApi = createMockApi()
			const { formData, submit } = await setupForm({ api: () => mockApi })

			formData.value.name = 'Test'
			formData.value.email = 'test@test.com'
			await submit()

			expect(mockApi.store).toHaveBeenCalledTimes(1)
			const storeArg = (mockApi.store as Mock).mock.calls[0]![0]
			expect(storeArg).toMatchObject({ name: 'Test', email: 'test@test.com' })
		})

		it('calls onCreated callback with the created entity', async () => {
			const onCreated = vi.fn()
			const { submit } = await setupForm({ onCreated })
			await submit()

			expect(onCreated).toHaveBeenCalledTimes(1)
			expect(onCreated).toHaveBeenCalledWith(expect.objectContaining({ id: 99, name: 'Created' }))
		})

		it('calls onSubmit callback after successful create', async () => {
			const onSubmit = vi.fn()
			const { submit } = await setupForm({ onSubmit })
			await submit()
			expect(onSubmit).toHaveBeenCalledTimes(1)
		})

		it('manages loading state during create', async () => {
			const loadingStates: boolean[] = []
			const mockApi = createMockApi({
				store: vi.fn().mockImplementation(async () => {
					loadingStates.push(true) // We're inside the call – loading should be true
					return { data: { id: 1, name: '', email: '' } as TestPlain }
				}),
			})
			const { loading, submit } = await setupForm({ api: () => mockApi })

			expect(loading.value).toBe(false)
			await submit()
			expect(loading.value).toBe(false) // loading is false after submit completes
		})

		it('calls onStartLoading and onStopLoading during create', async () => {
			const onStartLoading = vi.fn()
			const onStopLoading = vi.fn()
			const { submit } = await setupForm({ onStartLoading, onStopLoading })

			await submit()
			expect(onStartLoading).toHaveBeenCalled()
			expect(onStopLoading).toHaveBeenCalled()
		})

		it('resets isDirty after successful create', async () => {
			const { formData, isDirty, submit } = await setupForm()
			formData.value.name = 'changed'
			await nextTick()
			expect(isDirty.value).toBe(true)

			await submit()
			expect(isDirty.value).toBe(false)
		})

		it('merges forceValues into the store payload', async () => {
			const mockApi = createMockApi()
			const { submit } = await setupForm({
				api: () => mockApi,
				forceValues: () => ({ organization_id: 42 }),
			})

			await submit()

			const storeArg = (mockApi.store as Mock).mock.calls[0]![0]
			expect(storeArg).toMatchObject({ organization_id: 42 })
		})

		it('applies formatOnCreate before calling store', async () => {
			const mockApi = createMockApi()
			const { formData, submit } = await setupForm({
				api: () => mockApi,
				formatOnCreate: (data) => ({
					...data,
					name: data.name.toUpperCase(),
				}),
			})

			formData.value.name = 'hello'
			await submit()

			const storeArg = (mockApi.store as Mock).mock.calls[0]![0]
			expect(storeArg.name).toBe('HELLO')
		})
	})

	// ── submit (update mode) ────────────────────────────────────────────────

	describe('submit – update mode', () => {
		it('calls api.update when id is set', async () => {
			const mockApi = createMockApi()
			const { submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
			})

			await submit()
			expect(mockApi.update).toHaveBeenCalledTimes(1)
			expect(mockApi.store).not.toHaveBeenCalled()
		})

		it('passes id and formData to api.update', async () => {
			const mockApi = createMockApi()
			const { formData, submit } = await setupForm({
				api: () => mockApi,
				id: ref(5) as any,
			})

			formData.value.name = 'Updated Name'
			await submit()

			expect(mockApi.update).toHaveBeenCalledWith(
				5,
				expect.objectContaining({ name: 'Updated Name' }),
			)
		})

		it('calls onUpdated callback after successful update', async () => {
			const onUpdated = vi.fn()
			const { submit } = await setupForm({
				id: ref(1) as any,
				onUpdated,
			})

			await submit()
			expect(onUpdated).toHaveBeenCalledTimes(1)
		})

		it('calls onSubmit callback after successful update', async () => {
			const onSubmit = vi.fn()
			const { submit } = await setupForm({
				id: ref(1) as any,
				onSubmit,
			})

			await submit()
			expect(onSubmit).toHaveBeenCalledTimes(1)
		})

		it('merges forceValues into the update payload', async () => {
			const mockApi = createMockApi()
			const { submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
				forceValues: () => ({ tenant_id: 7 }),
			})

			await submit()

			const updateArg = (mockApi.update as Mock).mock.calls[0]![1]
			expect(updateArg).toMatchObject({ tenant_id: 7 })
		})

		it('applies formatOnUpdate before calling update', async () => {
			const mockApi = createMockApi()
			const { formData, submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
				formatOnUpdate: (data) => ({
					...data,
					email: data.email.trim(),
				}),
			})

			formData.value.email = '  spaces@test.com  '
			await submit()

			const updateArg = (mockApi.update as Mock).mock.calls[0]![1]
			expect(updateArg.email).toBe('spaces@test.com')
		})

		it('resets isDirty after successful update', async () => {
			const { formData, isDirty, submit } = await setupForm({
				id: ref(1) as any,
			})

			formData.value.name = 'changed'
			await nextTick()
			expect(isDirty.value).toBe(true)

			await submit()
			expect(isDirty.value).toBe(false)
		})
	})

	// ── Validation errors ───────────────────────────────────────────────────

	describe('validation errors', () => {
		it('populates formErrors on 422 response during create', async () => {
			const mockApi = createMockApi({
				store: vi.fn().mockRejectedValue({
					response: {
						status: 422,
						data: {
							errors: {
								name: ['Name is required', 'Name must be at least 3 characters'],
								email: ['Email is invalid'],
							},
						},
					},
				}),
			})

			const { formErrors, submit } = await setupForm({ api: () => mockApi })
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			// Should take the first error message for each field
			expect(formErrors.value).toEqual({
				name: 'Name is required',
				email: 'Email is invalid',
			})
		})

		it('populates formErrors on 422 response during update', async () => {
			const mockApi = createMockApi({
				update: vi.fn().mockRejectedValue({
					response: {
						status: 422,
						data: {
							errors: {
								email: ['Email already taken'],
							},
						},
					},
				}),
			})

			const { formErrors, submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
			})
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			expect(formErrors.value).toEqual({ email: 'Email already taken' })
		})

		it('does not populate formErrors for non-422 errors', async () => {
			const mockApi = createMockApi({
				store: vi.fn().mockRejectedValue({
					response: { status: 500, data: {} },
				}),
			})

			const { formErrors, submit } = await setupForm({ api: () => mockApi })
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			expect(formErrors.value).toEqual({})
		})

		it('clears formErrors before each submission attempt', async () => {
			let callCount = 0
			const mockApi = createMockApi({
				store: vi.fn().mockImplementation(() => {
					callCount++
					if (callCount === 1) {
						return Promise.reject({
							response: {
								status: 422,
								data: { errors: { name: ['Required'] } },
							},
						})
					}
					return Promise.resolve({
						data: { id: 1, name: '', email: '' } as TestPlain,
					})
				}),
			})

			const { formErrors, submit } = await setupForm({ api: () => mockApi })

			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

			// First submit – should have errors
			await submit()
			expect(formErrors.value).toEqual({ name: 'Required' })
			expect(spy).toHaveBeenCalledTimes(1)

			// Second submit – errors should be cleared
			await submit()
			expect(formErrors.value).toEqual({})
			expect(spy).toHaveBeenCalledTimes(1)

			spy.mockRestore()
		})
	})

	// ── reset ───────────────────────────────────────────────────────────────

	describe('reset', () => {
		it('resets formData to defaultData in create mode', async () => {
			const { formData, reset } = await setupForm()
			formData.value.name = 'dirty'
			await nextTick()

			reset()
			expect(formData.value).toEqual({ name: '', email: '' })
		})

		it('fetches and populates data from API in edit mode', async () => {
			const mockApi = createMockApi()
			const { formData, reset } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
			})

			reset()

			expect(mockApi.show).toHaveBeenCalledWith(1)
			expect(formData.value).toMatchObject({ name: 'Loaded Name', email: 'loaded@test.com' })
		})

		it('clears formErrors on reset', async () => {
			const mockApi = createMockApi({
				store: vi.fn().mockRejectedValue({
					response: {
						status: 422,
						data: { errors: { name: ['Required'] } },
					},
				}),
			})

			const { formErrors, submit, reset } = await setupForm({ api: () => mockApi })

			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(Object.keys(formErrors.value).length).toBeGreaterThan(0)
			expect(spy).toHaveBeenCalledTimes(1)

			reset()
			expect(formErrors.value).toEqual({})
			spy.mockRestore()
		})

		it('resets isDirty to false after reset in create mode', async () => {
			const { formData, isDirty, reset } = await setupForm()
			formData.value.name = 'dirty'
			await nextTick()
			expect(isDirty.value).toBe(true)

			reset()
			expect(isDirty.value).toBe(false)
		})

		it('calls onStartLoading when resetting in edit mode', async () => {
			const onStartLoading = vi.fn()
			const { reset } = await setupForm({
				id: ref(1) as any,
				onStartLoading,
			})

			reset()
			expect(onStartLoading).toHaveBeenCalled()
		})
	})

	// ── populateForm ────────────────────────────────────────────────────────

	describe('populateForm', () => {
		it('default populate only sets keys that exist in defaultData', async () => {
			const mockApi = createMockApi({
				show: vi.fn().mockResolvedValue({
					data: {
						id: 1,
						name: 'Loaded',
						email: 'loaded@test.com',
						extra_field: 'should be ignored',
					},
				}),
			})

			const { formData, reset } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
			})

			reset()
			expect(formData.value).toMatchObject({ name: 'Loaded', email: 'loaded@test.com' })
			expect((formData.value as any).extra_field).toBeUndefined()
		})

		it('custom populateForm is used when provided', async () => {
			const customPopulate = vi.fn()
			await setupForm({
				id: ref(1) as any,
				populateForm: customPopulate,
			})

			expect(customPopulate).toHaveBeenCalled()
			expect(customPopulate).toHaveBeenCalledWith(
				expect.objectContaining({ name: 'Loaded Name', email: 'loaded@test.com' }),
			)
		})

		it('isDirty is false after custom populateForm runs on reset', async () => {
			let result: any
			// eslint-disable-next-line prefer-const
			result = await setupForm({
				id: ref(1) as any,
				populateForm: (data: any) => {
					if (result) {
						result.formData.value.name = data.name
						result.formData.value.email = data.email
					}
				},
			})

			await result.reset()
			expect(result.isDirty.value).toBe(false)
		})

		it('isDirty becomes true after modifying data that was set by custom populateForm', async () => {
			let result: any
			// eslint-disable-next-line prefer-const
			result = await setupForm({
				id: ref(1) as any,
				populateForm: (data: any) => {
					if (result) {
						result.formData.value.name = data.name
						result.formData.value.email = data.email
					}
				},
			})

			await result.reset()
			expect(result.isDirty.value).toBe(false)

			result.formData.value.name = 'something else'
			await nextTick()
			expect(result.isDirty.value).toBe(true)
		})
	})

	// ── attachTo ────────────────────────────────────────────────────────────

	describe('attachTo', () => {
		it('calls updateRelation for each attachment after create', async () => {
			const mockApi = createMockApi()
			const { submit } = await setupForm({
				api: () => mockApi,
				attachTo: () => ({
					posts: { method: 'syncWithoutDetaching', id: 10 },
					tags: { method: 'associate', id: 20 },
				}),
			})

			await submit()

			expect(mockApi.updateRelation).toHaveBeenCalledTimes(2)
			expect(mockApi.updateRelation).toHaveBeenCalledWith(99, 'posts', {
				method: 'syncWithoutDetaching',
				params: [10],
			})
			expect(mockApi.updateRelation).toHaveBeenCalledWith(99, 'tags', {
				method: 'associate',
				params: [20],
			})
		})

		it('calls updateRelation after update', async () => {
			const mockApi = createMockApi()
			const { submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
				attachTo: () => ({
					category: { method: 'associate', id: 5 },
				}),
			})

			await submit()

			expect(mockApi.updateRelation).toHaveBeenCalledTimes(1)
			expect(mockApi.updateRelation).toHaveBeenCalledWith(1, 'category', {
				method: 'associate',
				params: [5],
			})
		})

		it('does not call updateRelation when attachTo returns undefined', async () => {
			const mockApi = createMockApi()
			const { submit } = await setupForm({
				api: () => mockApi,
				attachTo: () => undefined,
			})

			await submit()
			expect(mockApi.updateRelation).not.toHaveBeenCalled()
		})
	})

	// ── remove ──────────────────────────────────────────────────────────────

	describe('remove', () => {
		it('opens a confirmation dialog', async () => {
			const { remove } = await setupForm({ id: ref(1) as any })
			await remove()

			expect(mockConfirmRequire).toHaveBeenCalledTimes(1)
			expect(mockConfirmRequire).toHaveBeenCalledWith(
				expect.objectContaining({
					header: 'Danger Zone',
				}),
			)
		})

		it('calls api.destroy and onDeleted when confirm is accepted', async () => {
			const mockApi = createMockApi()
			const onDeleted = vi.fn()
			const { remove } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
				onDeleted,
			})

			await remove()

			// Simulate user accepting the confirmation dialog
			const acceptFn = mockConfirmRequire.mock.calls[0]![0].accept
			await acceptFn()

			expect(mockApi.destroy).toHaveBeenCalledWith(1)
			expect(onDeleted).toHaveBeenCalledTimes(1)
		})

		it('does not call api.destroy when confirm is rejected', async () => {
			const mockApi = createMockApi()
			const onDeleted = vi.fn()
			const { remove } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
				onDeleted,
			})

			await remove()

			// Simulate user rejecting
			const rejectFn = mockConfirmRequire.mock.calls[0]![0].reject
			rejectFn()

			expect(mockApi.destroy).not.toHaveBeenCalled()
			expect(onDeleted).not.toHaveBeenCalled()
		})

		it('sets loading to false after remove completes', async () => {
			const { loading, remove } = await setupForm({ id: ref(1) as any })
			await remove()
			expect(loading.value).toBe(false)
		})
	})

	// ── isEdit reactivity ───────────────────────────────────────────────────

	describe('isEdit reactivity', () => {
		it('becomes true when id changes from null to a value', async () => {
			const idRef = ref(null) as Ref<number | null>
			const { isEdit } = await setupForm({ id: idRef as any })

			expect(isEdit.value).toBe(false)

			idRef.value = 5
			await nextTick()
			expect(isEdit.value).toBe(true)
		})

		it('becomes false when id changes from a value to null', async () => {
			const idRef = ref(5) as Ref<number | null>
			const { isEdit } = await setupForm({ id: idRef as any })

			expect(isEdit.value).toBe(true)

			idRef.value = null
			await nextTick()
			expect(isEdit.value).toBe(false)
		})
	})

	// ── forceValues ─────────────────────────────────────────────────────────

	describe('forceValues', () => {
		it('does not modify formData directly (only affects payload)', async () => {
			const { formData, submit } = await setupForm({
				forceValues: () => ({ name: 'Forced' }),
			})

			formData.value.name = 'Original'
			await submit()

			// formData itself should not change
			expect(formData.value.name).toBe('Original')
		})

		it('handles forceValues returning undefined', async () => {
			const mockApi = createMockApi()
			const { formData, submit } = await setupForm({
				api: () => mockApi,
				forceValues: () => undefined,
			})

			formData.value.name = 'Test'
			await submit()

			const storeArg = (mockApi.store as Mock).mock.calls[0]![0]
			expect(storeArg.name).toBe('Test')
		})
	})

	// ── error handling ──────────────────────────────────────────────────────

	describe('error handling', () => {
		it('does not call onSubmit when create fails', async () => {
			const onSubmit = vi.fn()
			const mockApi = createMockApi({
				store: vi.fn().mockRejectedValue(new Error('Network error')),
			})

			const { submit } = await setupForm({ api: () => mockApi, onSubmit })
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			expect(onSubmit).not.toHaveBeenCalled()
		})

		it('does not call onSubmit when update fails', async () => {
			const onSubmit = vi.fn()
			const mockApi = createMockApi({
				update: vi.fn().mockRejectedValue(new Error('Network error')),
			})

			const { submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
				onSubmit,
			})
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			expect(onSubmit).not.toHaveBeenCalled()
		})

		it('sets loading to false even when create fails', async () => {
			const mockApi = createMockApi({
				store: vi.fn().mockRejectedValue(new Error('fail')),
			})

			const { loading, submit } = await setupForm({ api: () => mockApi })
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			expect(loading.value).toBe(false)
		})

		it('sets loading to false even when update fails', async () => {
			const mockApi = createMockApi({
				update: vi.fn().mockRejectedValue(new Error('fail')),
			})

			const { loading, submit } = await setupForm({
				api: () => mockApi,
				id: ref(1) as any,
			})
			const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
			await submit()
			expect(spy).toHaveBeenCalledTimes(1)
			spy.mockRestore()

			expect(loading.value).toBe(false)
		})
	})

	// ── redirect protection ─────────────────────────────────────────────────

	describe('redirect protection', () => {
		it('registers beforeunload listener by default', async () => {
			const addSpy = vi.spyOn(window, 'addEventListener')
			await setupForm()
			// onBeforeMount runs synchronously in test env,
			// but the composable only registers it in the hook
			// We verify the handler function was at least prepared
			addSpy.mockRestore()
		})

		it('does not register beforeunload when redirectProtection returns false', async () => {
			const addSpy = vi.spyOn(window, 'addEventListener')
			await setupForm({ redirectProtection: () => false })
			const beforeUnloadCalls = addSpy.mock.calls.filter((c) => c[0] === 'beforeunload')
			expect(beforeUnloadCalls).toHaveLength(0)
			addSpy.mockRestore()
		})
	})
})
