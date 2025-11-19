declare const _brand: unique symbol
export type Brand<B> = { [_brand]: B }
export type Branded<T, B> = { value: T } & Brand<B>
