export type Action<TParameters extends any[]> = (...args: TParameters) => unknown;
