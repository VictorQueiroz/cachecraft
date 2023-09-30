
# CacheCraft

![npm](https://img.shields.io/npm/v/cachecraft)
![build](https://img.shields.io/github/workflow/status/username/cachecraft/CI)
![license](https://img.shields.io/npm/l/cachecraft)

CacheCraft is a TypeScript-based caching library that provides a collection of classes to easily memorize and cache the results of function calls. It offers a variety of caching mechanisms including simple key-value mapping, list-based caching, and weak reference caching.

## Features

- **Memorizer**: Simple key-value caching.
- **MemorizerList**: Caching for list-like data structures.
- **WeakMemorizer**: WeakMap-based caching for objects.
- **LastKnownMemorizer**: Caches the last known value.

## Installation

```bash
npm install cachecraft
```

or

```bash
yarn add cachecraft
```

## Usage

### Memorizer

```typescript
import { Memorizer } from 'cachecraft';

const memo = new Memorizer<number, string>((value) => value.toString());
console.log(memo.get(1)); // "1"
```

### MemorizerList

```typescript
import { MemorizerList } from 'cachecraft';

const memoList = new MemorizerList<number, string>((value) => value.toString());
console.log(memoList.get(1)); // "1"
```

### WeakMemorizer

```typescript
import { WeakMemorizer } from 'cachecraft';

const weakMemo = new WeakMemorizer<object, string>((value) => JSON.stringify(value));
const obj = { key: 'value' };
console.log(weakMemo.get(obj)); // "{"key":"value"}"
```

### LastKnownMemorizer

```typescript
import { LastKnownMemorizer } from 'cachecraft';

const lastKnownMemo = new LastKnownMemorizer<number, string>((value) => value.toString());
console.log(lastKnownMemo.get(1)); // "1"
```

## Custom Comparers

You can also specify custom comparers for `MemorizerList` and `LastKnownMemorizer`:

```typescript
import { MemorizerList, LastKnownMemorizer } from 'cachecraft';

const customComparer = (a: number, b: number) => a % 10 === b % 10;

const memoList = new MemorizerList<number, string>((value) => value.toString(), customComparer);
const lastKnownMemo = new LastKnownMemorizer<number, string>((value) => value.toString(), customComparer);
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
