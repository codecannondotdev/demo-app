import type { IApi } from '@/helpers/models/Api'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Model as ModelType, Plain } from '@/helpers/models/Model'

export default class DetailsState<Api extends IApi<Model>, Model extends ModelType> {
	api!: Api
	isLoaded: Ref<boolean> = ref(false)
	isLoading: Ref<boolean> = ref(false)
	details: Ref<Plain<Model> | null> = ref(null)
	defaultParams: Parameters<Api['show']>[1] = {}

	async getDetails(id: Parameters<Api['show']>[0], params?: Parameters<Api['show']>[1]) {
		if (this.isLoading.value) return
		this.isLoading.value = true
		const response = await this.api.show(id, { ...this.defaultParams, ...params })
		this.details.value = response.data
		this.isLoading.value = false
		this.isLoaded.value = true
	}

	async update(params: Parameters<Api['update']>[1]) {
		if (!this.isLoaded.value || !this.details.value) return
		if (this.isLoading.value) return
		this.isLoading.value = true
		const response = await this.api.update(this.details.value.id, params)
		this.details.value = response.data
		this.isLoading.value = false
	}

	clearDetails() {
		this.details.value = null
		this.isLoaded.value = false
	}
}
