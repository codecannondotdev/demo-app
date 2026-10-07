# API

An `Api.ts` file is generated for each module. We have a dedicated documentation
page for APIs, which you can find [here](/frontend/apis).

```typescript
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
```
