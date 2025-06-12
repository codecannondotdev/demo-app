import type { UserModel, UserStorePayload, UserUpdatePayload } from '@/models/User/Model'
import Api from '@/helpers/models/Api'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export default class UsersApi extends Api<
	UserModel,
	LaravelPaginationResponse<UserModel>,
	UserStorePayload,
	UserUpdatePayload
> {
	route = 'users'
}
