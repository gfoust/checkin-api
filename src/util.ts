
export type Dictionary<T, I extends object = any> = {
  [P in keyof I]: T;
};

export type Maybe<T> = T | undefined;

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(undefined), ms);
  });
}
