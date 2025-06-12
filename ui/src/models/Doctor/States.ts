import type { DoctorModel } from '@/models/Doctor/Model'
import DoctorsApi from '@/models/Doctor/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class DoctorDetailsState extends DetailsState<DoctorsApi, DoctorModel> {
	api = new DoctorsApi()
}

export function useDoctorDetailsState() {
	return new DoctorDetailsState()
}

export class DoctorListState extends ListState<
	DoctorsApi,
	DoctorModel,
	LaravelPaginationResponse<DoctorModel>
> {
	api = new DoctorsApi()
}

export function useDoctorListState() {
	return new DoctorListState()
}
