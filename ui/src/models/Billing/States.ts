import type { BillingModel } from '@/models/Billing/Model'
import BillingsApi from '@/models/Billing/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class BillingDetailsState extends DetailsState<BillingsApi, BillingModel> {
	api = new BillingsApi()
}

export function useBillingDetailsState() {
	return new BillingDetailsState()
}

export class BillingListState extends ListState<
	BillingsApi,
	BillingModel,
	LaravelPaginationResponse<BillingModel>
> {
	api = new BillingsApi()
}

export function useBillingListState() {
	return new BillingListState()
}
