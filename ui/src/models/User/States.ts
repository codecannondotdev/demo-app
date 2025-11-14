import type { UserModel } from '@/models/User/Model'
import UsersApi from '@/models/User/Api'
import DetailsState from '@/helpers/models/DetailsState'
import ListState from '@/helpers/models/ListState'
import type { LaravelPaginationResponse } from '@/interfaces/models/Laravel'

export class UserDetailsState extends DetailsState<UsersApi, UserModel> {
	api = new UsersApi()
}

export function useUserDetailsState() {
	return new UserDetailsState()
}

export class UserListState extends ListState<
	UsersApi,
	UserModel,
	LaravelPaginationResponse<UserModel>
> {
	api = new UsersApi()
}

export function useUserListState() {
	return new UserListState()
}
