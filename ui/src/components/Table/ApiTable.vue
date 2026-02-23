<template>
	<div
		ref="apiTable"
		class="ui-api-table">
		<Card class="ui-api-table__container-card">
			<template #content>
				<DataTable
					class="ui-api-table__table"
					:class="{ 'ui-api-table__table--clickable': props.clickable }"
					:value="listState.list.value"
					v-bind="$attrs"
					:selection-mode="props.selectionMode"
					:loading="isLoading"
					@row-click="emit('row-click', $event)">
					<template #loading>
						<HeaderLoader :is-loading="isLoading" />
					</template>
					<slot></slot>
				</DataTable>
				<Paginator
					:model-value="props.listState.pagination.value.current_page"
					:rows="listState.pagination.value.per_page"
					:total-records="props.listState.pagination.value.total"
					@page="getList($event)"></Paginator>
			</template>
		</Card>
	</div>
</template>

<script lang="ts">
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable'
import Paginator from 'primevue/paginator'
import Card from 'primevue/card'
import type { Model as ModelType } from '@/helpers/models/Model'

export interface ApiTableInjectionType<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
> {
	listState: ListState<Api, Model, ModelList> | undefined
	selectable: boolean
	selected: Set<Model>
	isLoading: Ref<boolean>
	selectionMode?: 'single' | 'multiple'
}

const injectionSymbol = Symbol('ApiTableInject')

export function createInjectionKey<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
>() {
	return injectionSymbol as InjectionKey<ApiTableInjectionType<Api, Model, ModelList>>
}
</script>

<script
	setup
	lang="ts"
	generic="
		Api extends IApi<Model, ModelList>,
		Model extends ModelType,
		ModelList extends LaravelPaginationResponse<Model>
	">
import { computed, type InjectionKey, provide, type Ref, ref, nextTick, watch } from 'vue'
import ListState from '@/helpers/models/ListState'
import type { IApi } from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import HeaderLoader from '@/components/HeaderLoader.vue'

defineOptions({
	inheritAttrs: false,
})

const emit = defineEmits<{
	(e: 'get-list'): void
	(e: 'update:pagination-page', page: number): void
	(e: 'row-click', event: DataTableRowClickEvent<any>): void
}>()

const props = withDefaults(
	defineProps<{
		listState: ListState<Api, Model, ModelList>
		loading?: boolean
		selectable?: boolean
		selected?: Set<Model>
		maxHeight?: number | string
		selectionMode?: 'single' | 'multiple'
		clickable?: boolean
	}>(),
	{
		loading: undefined,
		selectable: false,
		selected: () => new Set(),
		maxHeight: 'auto',
		selectionMode: undefined,
		clickable: false,
	},
)

const isLoading = computed(() => {
	return props.loading !== undefined ? props.loading : !!props.listState?.isLoading.value
})

function getList(page: { page: number }) {
	if (props.listState) {
		props.listState.getList({ page: page.page + 1 })
	}
	emit('update:pagination-page', page.page + 1)
}

const injectionKey = createInjectionKey<Api, Model, ModelList>()
const providedData: ApiTableInjectionType<Api, Model, ModelList> = {
	listState: props.listState,
	selectable: props.selectable,
	selected: props.selected,
	isLoading: isLoading,
}
provide(injectionKey, providedData)

const maxHeightPx = computed(() => {
	if (props.maxHeight === 'auto') {
		return 'none'
	}
	return `${props.maxHeight}px`
})

const apiTable = ref<HTMLElement>()
const headerHeight = ref('0px')

function updateHeaderHeight() {
	nextTick(() => {
		if (!apiTable.value) return
		const thead = apiTable.value.querySelector('.p-datatable-table-container thead')
		if (thead) {
			headerHeight.value = `${(thead as HTMLElement).offsetHeight}px`
		}
	})
}

watch(
	() => isLoading.value,
	() => {
		updateHeaderHeight()
	},
	{
		immediate: true,
	},
)
</script>

<style scoped lang="scss">
.ui-api-table {
	width: 100%;

	.ui-api-table__table--clickable {
		&:deep(.p-datatable-tbody) {
			tr {
				cursor: pointer;
			}
		}
	}

	.ui-api-table__container-card {
		overflow: hidden;

		&:deep(.p-card-body) {
			overflow: auto;
			padding: 0;

			.ui-api-table__table {
				:deep(.p-datatable-table-container) {
					max-height: v-bind(maxHeightPx);

					tbody {
						tr {
							&:hover {
								background-color: var(--p-datatable-row-hover-background);
							}
						}
					}
				}
			}

			.p-datatable-mask.p-overlay-mask {
				height: 2px;
				top: v-bind(headerHeight);
				background: transparent;
			}
		}
	}
}
</style>
