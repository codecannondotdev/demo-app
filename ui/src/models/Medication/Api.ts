import type {
	MedicationModel,
	MedicationStorePayload,
	MedicationUpdatePayload,
} from '@/models/Medication/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class MedicationsApi extends Api<
	MedicationModel,
	LaravelPaginationResponse<MedicationModel>,
	MedicationStorePayload,
	MedicationUpdatePayload
> {
	route = 'medications'
}
