export class Memorizer<T = unknown, U = unknown> {
  readonly #cache;
  readonly #creator;
  public constructor(creator: (value: T) => U) {
    this.#cache = new Map<T, U>();
    this.#creator = creator;
  }
  public get(value: T) {
    const cached = this.#cache.get(value);
    if (cached) {
      return cached;
    }
    const result = this.#creator(value);
    this.#cache.set(value, result);
    return result;
  }
}

interface IMemorizerListCachedItem<T, U> {
  key: T;
  value: U;
}

function referenceComparer<T>(a: T, b: T) {
  return a === b;
}

export class MemorizerList<T = unknown, U = unknown> {
  readonly #cache;
  readonly #creator;
  readonly #comparer;
  public constructor(
    creator: (value: T) => U,
    comparer: (a: T, b: T) => boolean = referenceComparer,
  ) {
    this.#cache = new Array<IMemorizerListCachedItem<T, U>>();
    this.#creator = creator;
    this.#comparer = comparer;
  }
  public get(key: T): U {
    const cached = this.#cache.find((c) => this.#comparer(c.key, key));
    if (cached) {
      return cached.value;
    }
    const value = this.#creator(key);
    this.#cache.push({
      key,
      value,
    });
    return value;
  }
}

export class WeakMemorizer<T extends object, U = unknown> {
  readonly #cache;
  readonly #creator;
  /**
   * this function should not throw
   * @param creator function that is called when a value is not found in the cache
   * @returns a new instance of the value
   */
  public constructor(creator: (value: T) => U) {
    this.#cache = new WeakMap<T, U>();
    this.#creator = creator;
  }
  public get(value: T) {
    const cached = this.#cache.get(value);
    if (cached) {
      return cached;
    }
    const result = this.#creator(value);
    this.#cache.set(value, result);
    return result;
  }
}

export class LastKnownMemorizer<T = unknown, U = unknown> {
  readonly #creator;
  readonly #comparer;
  #cache: {
    key: T;
    value: U;
  } | null;
  public constructor(
    creator: (value: T) => U,
    comparer: (a: T, b: T) => boolean = referenceComparer,
  ) {
    this.#cache = null;
    this.#creator = creator;
    this.#comparer = comparer;
  }
  public get(key: T): U {
    const cached = this.#cache;
    if (cached && this.#comparer(cached.key, key)) {
      return cached.value;
    }
    const value = this.#creator(key);
    this.#cache = {
      key,
      value,
    };
    return value;
  }
}
