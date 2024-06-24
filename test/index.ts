import test from "ava";
import sinon from "sinon";
import {
  LastKnownMemorizer,
  Memorizer,
  MemorizerList,
  WeakMemorizer,
} from "../src";

test("LastKnownMemorizer: it should only keep the last computed value", (t) => {
  const memo = new LastKnownMemorizer((value: number) => ({
    value: value * 2,
  }));
  const obj = memo.get(100);
  t.assert(obj.value === 200);
  const obj2 = memo.get(200);
  t.assert(obj2.value === 400);
  t.assert(memo.get(100).value === 200 && memo.get(100) !== obj);
});

test("MemorizerList: it should use comparer function to return the correct value", (t) => {
  const comparer = sinon.spy((a: string, b: string) => a === b);
  const memo = new MemorizerList(
    (value: string) => ({
      length: value.length,
    }),
    comparer,
  );
  t.assert(memo.get("hello").length === 5);
  t.assert(comparer.notCalled);
  t.assert(memo.get("hello").length === 5);
  t.assert(comparer.calledOnceWithExactly("hello", "hello"));
});

test("WeakMemorizer: it should only accept objects", (t) => {
  // @ts-expect-error ignore unused type
  type Memo = WeakMemorizer<
    // @ts-expect-error first argument must only accept objects
    string,
    string
  >;

  // @ts-expect-error ignore unused type
  type Memo2 = WeakMemorizer<{}, string>;

  t.assert(
    new WeakMemorizer((value: { a: number }) => `${value.a}_hello`).get({
      a: 1,
    }) === "1_hello",
  );
});

test("WeakMemorizer: it should store object references in the cache", (t) => {
  interface IKey {
    a: string;
    b: string;
  }
  const memo = new WeakMemorizer((value: IKey) => ({
    result: `${value.a}-${value.b}`,
  }));
  const k1: IKey = {
    a: "hello",
    b: "world",
  };
  const v1 = memo.get(k1);
  t.assert(v1.result === "hello-world");
  t.assert(memo.get(k1).result === "hello-world");
  t.assert(memo.get(k1) === v1);
});

test("Memorizer: it should not call creator if key does not change", (t) => {
  const creator = sinon.spy((value: number) => ({
    result: value * 2,
  }));
  const memo = new Memorizer(creator);
  t.assert(!creator.called);

  const result1 = memo.get(2);
  t.deepEqual(result1, {
    result: 4,
  });

  t.assert(creator.calledOnceWithExactly(2));

  const result2 = memo.get(2);
  t.assert(creator.calledOnceWithExactly(2));
  t.assert(result1 === result2);
});

test("Memorizer: it should keep returned references for several keys", (t) => {
  interface IResult {
    value: number;
  }
  interface IKey {
    value: number;
  }
  interface ICachedKey {
    result: IResult;
    key: IKey;
  }
  const memo = new Memorizer((obj: IKey) => ({
    value: obj.value / 4,
  }));
  const keys = new Array<ICachedKey>(20);
  for (let i = 0; i < keys.length; i++) {
    const key: IKey = {
      value: 2 ** i,
    };
    const result = memo.get(key);
    keys[i] = {
      result,
      key,
    };
  }
  for (const item of keys) {
    t.assert(memo.get(item.key) === item.result);
  }
});
