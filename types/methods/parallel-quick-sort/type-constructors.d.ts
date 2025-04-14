import { TypedArrayConstructor } from "./parallel-quick-sort";

export const typeConstructors: {
  Int8Array: TypedArrayConstructor<Int8Array>;
  Uint8Array: TypedArrayConstructor<Uint8Array>;
  Uint8ClampedArray: TypedArrayConstructor<Uint8ClampedArray>;
  Int16Array: TypedArrayConstructor<Int16Array>;
  Uint16Array: TypedArrayConstructor<Uint16Array>;
  Int32Array: TypedArrayConstructor<Int32Array>;
  Uint32Array: TypedArrayConstructor<Uint32Array>;
  Float32Array: TypedArrayConstructor<Float32Array>;
  Float64Array: TypedArrayConstructor<Float64Array>;
  BigInt64Array: TypedArrayConstructor<BigInt64Array>;
  BigUint64Array: TypedArrayConstructor<BigUint64Array>;
  [key: string]: TypedArrayConstructor | undefined;
};
