import type {
	DepartmentModel,
	DepartmentStorePayload,
	DepartmentUpdatePayload,
} from '@/models/Department/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class DepartmentsApi extends Api<
	DepartmentModel,
	LaravelPaginationResponse<DepartmentModel>,
	DepartmentStorePayload,
	DepartmentUpdatePayload
> {
	route = 'departments'
}
