export function exclude<T, Key extends keyof T>(data: T, keys: Key[]): Omit<T, Key> {
  const clone = { ...data };
  
  keys.forEach((key) => {
    delete clone[key];
  });

  return clone;
}