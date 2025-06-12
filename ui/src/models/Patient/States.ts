import type { PatientModel } from '@/models/Patient/Model'
import PatientsApi from '@/models/Patient/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class PatientDetailsState extends DetailsState<PatientsApi, PatientModel> {
	api = new PatientsApi()
}

export function usePatientDetailsState() {
	return new PatientDetailsState()
}

export class PatientListState extends ListState<
	PatientsApi,
	PatientModel,
	LaravelPaginationResponse<PatientModel>
> {
	api = new PatientsApi()
}

export function usePatientListState() {
	return new PatientListState()
}
