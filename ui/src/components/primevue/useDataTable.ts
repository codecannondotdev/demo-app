import { Column, DataTable, type ColumnEmits, type ColumnProps, type ColumnSlots } from 'primevue'
import type { VNode } from 'vue'
import type { DefineComponent } from '@primevue/core'

export default function useDataTable<T>() {
	return {
		DataTable,
		Column: Column as DefineComponent<
			ColumnProps,
			Omit<ColumnSlots, 'body'> & {
				body(scope: Omit<Parameters<ColumnSlots['body']>[0], 'data'> & { data: T }): VNode[]
			},
			ColumnEmits
		>,
	}
}
