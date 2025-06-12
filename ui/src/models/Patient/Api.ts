import type {
	PatientModel,
	PatientStorePayload,
	PatientUpdatePayload,
} from '@/models/Patient/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class PatientsApi extends Api<
	PatientModel,
	LaravelPaginationResponse<PatientModel>,
	PatientStorePayload,
	PatientUpdatePayload
> {
	route = 'patients'
}
