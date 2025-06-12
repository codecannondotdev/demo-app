<template>
	<div class="ui-api-table">
		<Card class="ui-api-table__container-card">
			<template #content>
				<DataTable
					class="ui-api-table__table"
					:class="{ 'ui-api-table__table--clickable': props.clickable }"
					:value="listState.list.value"
					v-bind="$attrs"
					:selection-mode="props.selectionMode"
					@row-click="emit('row-click', $event)">
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
import DataTable from 'primevue/datatable'
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
import {
	defineProps,
	computed,
	defineEmits,
	defineOptions,
	type PropType,
	type InjectionKey,
	provide,
	reactive,
	type Ref,
} from 'vue'
import ListState from '@/helpers/models/ListState'
import type { IApi } from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

defineOptions({
	inheritAttrs: false,
})

const emit = defineEmits(['get-list', 'update:pagination-page', 'row-click'])

const props = defineProps({
	listState: {
		type: ListState<Api, Model, ModelList>,
		required: true,
	},
	loading: {
		type: Boolean,
		required: false,
	},
	selectable: {
		type: Boolean,
		default: false,
	},
	selected: {
		type: Set as PropType<Set<Model>>,
		default: () => reactive(new Set()),
	},
	maxHeight: {
		type: [Number, String],
		default: 'auto',
	},
	selectionMode: {
		type: String as PropType<'single' | 'multiple'>,
		default: undefined,
	},
	clickable: {
		type: Boolean,
		default: false,
	},
})

const isLoading = computed(() => {
	return props.loading || !!props.listState?.isLoading.value
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
	}
}
</style>
