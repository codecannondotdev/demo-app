import type { TagModel, TagStorePayload, TagUpdatePayload } from '@/models/Tag/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class TagsApi extends Api<
	TagModel,
	LaravelPaginationResponse<TagModel>,
	TagStorePayload,
	TagUpdatePayload
> {
	route = 'tags'
}
