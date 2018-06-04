import { silentPromise, SilentPromise, SilentPromiseError } from "../src";

let sPromise: SilentPromise<any>;

const promiseFn = (shouldResolve: boolean): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (shouldResolve) {
            resolve("success");
        }
        else {
            reject("failure");
        }
    })
};

describe("silentPromise without await should never reject", () => {
    test("silentPromise on resolved promise", async () => {
        const resolvedPromise = promiseFn(true);
        await expect(silentPromise(resolvedPromise)).resolves.toBeDefined();
    });

    test("silentPromise on rejected promise", async () => {
        const rejectedPromise = promiseFn(false);
        await expect(silentPromise(rejectedPromise)).resolves.toBeDefined();
    });
});

describe("await silentPromise on resolved promise", () => {
    beforeAll(() => {
        sPromise = silentPromise(promiseFn(true));
    });

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

describe("await silentPromise on rejected promise", () => {
    beforeAll(() => {
        sPromise = silentPromise(promiseFn(false));
    });

    test('result should be undefined', async () => {
        expect.assertions(1);
        const [error, result] = await sPromise;
        console.log(error);
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
