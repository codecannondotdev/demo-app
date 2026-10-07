import Api from '@/helpers/models/Api'
import type { NurseModel, NurseStorePayload, NurseUpdatePayload } from '@/models/Nurse/Model'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class NursesApi extends Api<
	NurseModel,
	LaravelPaginationResponse<NurseModel>,
	NurseStorePayload,
	NurseUpdatePayload
> {
	route = 'nurses'
}
