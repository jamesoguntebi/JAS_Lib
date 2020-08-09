

export type KeysOfType<TObj, TProp, K extends keyof TObj = keyof TObj> =
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#conditional-types
    K extends K ?
    TObj[K] extends TProp ? K : never :
    never;
