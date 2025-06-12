import type { DoctorModel, DoctorStorePayload, DoctorUpdatePayload } from '@/models/Doctor/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class DoctorsApi extends Api<
	DoctorModel,
	LaravelPaginationResponse<DoctorModel>,
	DoctorStorePayload,
	DoctorUpdatePayload
> {
	route = 'doctors'
}
