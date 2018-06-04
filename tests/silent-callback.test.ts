import { Callback, silentCallback, SilentPromise, SilentPromiseError } from "../src";

let sPromise: SilentPromise<any>;

const successCallbackFunction = (a: number, b: number, c: number, cb: Callback<number>) => {
    cb(undefined, a + b + c);
};
const errorCallbackFunction = (cb: Callback<number>) => {
    cb("error");
};

describe("silentCallback without await should never reject", () => {
    test("silentCallback on successCallbackFunction", async () => {
        await expect(silentCallback(successCallbackFunction)(1, 2, 3)).resolves.toBeDefined();
    });

    test("silentPromise on errorCallbackFunction", async () => {
        await expect(silentCallback(errorCallbackFunction)()).resolves.toBeDefined();
    });
});

describe("await silentCallback on successCallbackFunction", () => {
    beforeAll(() => sPromise = silentCallback(successCallbackFunction)(1, 2, 3));
    
    test('error.getError() should be undefined', async () => {
        expect.assertions(1);
        const [error] = await sPromise;
        expect(error.getError()).toBeUndefined();
    });

    test('error.ifError().thenDo() should not call action argument', async () => {
        expect.assertions(1);
        const [error] = await sPromise;
        const action = jest.fn();
        error.ifError().thenDo(action);
        expect(action).not.toHaveBeenCalled();
    });

    test('error.ifError().thenStopExecution() should not throw', async () => {
        expect.assertions(1);
        const [error] = await sPromise;
        expect(error.ifError().thenStopExecution).not.toThrow();
    });

    test('result should not be undefined', async () => {
        expect.assertions(1);
        const [, result] = await sPromise;
        expect(result).toBeDefined();
    });
});

describe("await silentPromise on errorCallbackFunction", () => {
    beforeAll(() => sPromise = silentCallback(errorCallbackFunction)());


    test('result should be undefined', async () => {
        expect.assertions(1);
        const [, result] = await sPromise;
        expect(result).toBeUndefined();
    });

    test('error.getError() should be defined', async () => {
        expect.assertions(1);
        const [error] = await sPromise;
        expect(error.getError()).toBeDefined();
    });

    test('error.ifError().thenDo() should call action argument', async () => {
        expect.assertions(1);
        const [error] = await sPromise;
        const action = jest.fn();
        error.ifError().thenDo(action);
        expect(action).toHaveBeenCalledTimes(1);
    });

    test('error.ifError().thenStopExecution() should throw error', async () => {
        expect.assertions(1);
        const [error] = await sPromise;
        expect(error.ifError().thenStopExecution).toThrow(SilentPromiseError);
    });
});

describe("silentCallback on successCallbackFunction with and without bind", () => {
    function fn(n1: number, n2: number, cb: Callback<number>) {
        this.test.call(n1 + n2);
        cb(undefined, n1 + n2);
    }

    test("should attach bind argument as this", async () => {
        expect.assertions(1);
        const thisArg = {
            test: {
                call: jest.fn()
            }
        };

        await silentCallback(fn, thisArg)(1, 2);
        expect(thisArg.test.call).toHaveBeenLastCalledWith(3);
    });

    test("successCallbackFunction should throw error because this is undefined", async () => {
        expect.assertions(1);
        const [error] = await silentCallback(fn)(1, 2);
        const throwError = () => {
            throw error.getError();
        };
        expect(throwError).toThrow(TypeError);
    });
});
