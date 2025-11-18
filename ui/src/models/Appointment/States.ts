import type { AppointmentModel } from '@/models/Appointment/Model'
import AppointmentsApi from '@/models/Appointment/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class AppointmentDetailsState extends DetailsState<AppointmentsApi, AppointmentModel> {
	api = new AppointmentsApi()
}

export function useAppointmentDetailsState() {
	return new AppointmentDetailsState()
}

export class AppointmentListState extends ListState<
	AppointmentsApi,
	AppointmentModel,
	LaravelPaginationResponse<AppointmentModel>
> {
	api = new AppointmentsApi()
}

export function useAppointmentListState() {
	return new AppointmentListState()
}
