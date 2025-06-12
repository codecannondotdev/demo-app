import type {
	AppointmentModel,
	AppointmentStorePayload,
	AppointmentUpdatePayload,
} from '@/models/Appointment/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class AppointmentsApi extends Api<
	AppointmentModel,
	LaravelPaginationResponse<AppointmentModel>,
	AppointmentStorePayload,
	AppointmentUpdatePayload
> {
	route = 'appointments'
}
