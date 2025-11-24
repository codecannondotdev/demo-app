import type { TreatmentModel } from '@/models/Treatment/Model'
import TreatmentsApi from '@/models/Treatment/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class TreatmentDetailsState extends DetailsState<TreatmentsApi, TreatmentModel> {
	api = new TreatmentsApi()
}

export function useTreatmentDetailsState() {
	return new TreatmentDetailsState()
}

export class TreatmentListState extends ListState<
	TreatmentsApi,
	TreatmentModel,
	LaravelPaginationResponse<TreatmentModel>
> {
	api = new TreatmentsApi()
}

export function useTreatmentListState() {
	return new TreatmentListState()
}
