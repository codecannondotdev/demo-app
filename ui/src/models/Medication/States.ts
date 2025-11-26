import type { MedicationModel } from '@/models/Medication/Model'
import MedicationsApi from '@/models/Medication/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class MedicationDetailsState extends DetailsState<MedicationsApi, MedicationModel> {
	api = new MedicationsApi()
}

export function useMedicationDetailsState() {
	return new MedicationDetailsState()
}

export class MedicationListState extends ListState<
	MedicationsApi,
	MedicationModel,
	LaravelPaginationResponse<MedicationModel>
> {
	api = new MedicationsApi()
}

export function useMedicationListState() {
	return new MedicationListState()
}
