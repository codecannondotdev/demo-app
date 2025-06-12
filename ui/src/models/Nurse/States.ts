import type { NurseModel } from '@/models/Nurse/Model'
import NursesApi from '@/models/Nurse/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class NurseDetailsState extends DetailsState<NursesApi, NurseModel> {
	api = new NursesApi()
}

export function useNurseDetailsState() {
	return new NurseDetailsState()
}

export class NurseListState extends ListState<
	NursesApi,
	NurseModel,
	LaravelPaginationResponse<NurseModel>
> {
	api = new NursesApi()
}

export function useNurseListState() {
	return new NurseListState()
}
