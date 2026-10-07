# Frontend Models

A `Model.ts` file is generated for each module. We have a dedicated documentation
page for models, which you can find [here](/frontend/model).

```typescript
import type { Column, Model, Plain } from '@/helpers/models/Model'
import type { RoleEnum } from './Enums'

export interface UserStorePayload {
	name: string
	email: string
}

export interface UserUpdatePayload {
	name?: string
	email?: string
}

export type UserModel = Model<{
	id: Column<number>
	name: Column<string>
	email: Column<string>
	role: Column<RoleEnum>
	verified: Column<boolean>
	created_at: Column<string>
	updated_at: Column<string>
}>

export type User = Plain<UserModel>
```
