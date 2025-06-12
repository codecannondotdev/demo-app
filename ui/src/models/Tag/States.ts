import type { TagModel } from '@/models/Tag/Model'
import TagsApi from '@/models/Tag/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class TagDetailsState extends DetailsState<TagsApi, TagModel> {
	api = new TagsApi()
}

export function useTagDetailsState() {
	return new TagDetailsState()
}

export class TagListState extends ListState<
	TagsApi,
	TagModel,
	LaravelPaginationResponse<TagModel>
> {
	api = new TagsApi()
}

export function useTagListState() {
	return new TagListState()
}
