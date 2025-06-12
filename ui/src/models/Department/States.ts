import type { DepartmentModel } from '@/models/Department/Model'
import DepartmentsApi from '@/models/Department/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class DepartmentDetailsState extends DetailsState<DepartmentsApi, DepartmentModel> {
	api = new DepartmentsApi()
}

export function useDepartmentDetailsState() {
	return new DepartmentDetailsState()
}

export class DepartmentListState extends ListState<
	DepartmentsApi,
	DepartmentModel,
	LaravelPaginationResponse<DepartmentModel>
> {
	api = new DepartmentsApi()
}

export function useDepartmentListState() {
	return new DepartmentListState()
}
