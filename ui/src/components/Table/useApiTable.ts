import type { IApi } from '@/helpers/models/Api'
import type { Model as ModelType, Plain } from '@/helpers/models/Model'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'
import ApiTable from './ApiTable.vue'
import ApiTableLinkButton from './ApiTableLinkButton.vue'
import ApiTableRemoveButton from './ApiTableRemoveButton.vue'
import { Column, type ColumnEmits, type ColumnProps, type ColumnSlots } from 'primevue'
import type { VNode } from 'vue'
import type ListState from '@/helpers/models/ListState'
import type { DefineComponent } from '@primevue/core'

export default function useApiTable<
	Api extends IApi<Model, ModelList>,
	Model extends ModelType,
	ModelList extends LaravelPaginationResponse<Model>,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
>(_listState?: ListState<Api, Model, ModelList>) {
	return {
		ApiTable: ApiTable as typeof ApiTable<Api, Model, ModelList>,
		ApiTableLinkButton,
		ApiTableRemoveButton: ApiTableRemoveButton as typeof ApiTableRemoveButton<
			Api,
			Model,
			ModelList
		>,
		Column: Column as DefineComponent<
			ColumnProps,
			Omit<ColumnSlots, 'body'> & {
				body(
					scope: Omit<Parameters<ColumnSlots['body']>[0], 'data'> & { data: Plain<Model> },
				): VNode[]
			},
			ColumnEmits
		>,
	}
}
