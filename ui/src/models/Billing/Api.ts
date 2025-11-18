import type {
	BillingModel,
	BillingStorePayload,
	BillingUpdatePayload,
} from '@/models/Billing/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class BillingsApi extends Api<
	BillingModel,
	LaravelPaginationResponse<BillingModel>,
	BillingStorePayload,
	BillingUpdatePayload
> {
	route = 'billings'
}
