import type {
	TreatmentModel,
	TreatmentStorePayload,
	TreatmentUpdatePayload,
} from '@/models/Treatment/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class TreatmentsApi extends Api<
	TreatmentModel,
	LaravelPaginationResponse<TreatmentModel>,
	TreatmentStorePayload,
	TreatmentUpdatePayload
> {
	route = 'treatments'
}
