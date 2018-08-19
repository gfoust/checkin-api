
export type Dictionary<T, I extends object = any> = {
  [P in keyof I]: T;
};

export type Maybe<T> = T | undefined;
