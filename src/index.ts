import getObjectPropertyDescriptors from "object.getownpropertydescriptors";
import PromiseError from "./promise-error";

export { SilentPromiseError } from "./silent-promise-error";
export { default as PromiseError } from "./promise-error";

export class SilentPromise<T> extends Promise<[PromiseError, T | undefined]> {}

export const bind = Symbol("_silent_promise_callback_bind_arg");
export function bindTo(thisArg: any): any {
    const bindArg: any = {};
    bindArg[bind] = thisArg;
    return bindArg;
}

export type Callback<T> = (error: any, result?: T) => any | void;
export type RestArgumentFunction = (...args: any[]) => any | void;
export type SilentPromiseFunction<T> = (...args: any[]) => SilentPromise<T>;

export function silentPromise<T>(promise: Promise<T>): SilentPromise<T> {
    const p = promise;
    return new Promise((resolve) => {
        p
            .then((result) => resolve([new PromiseError(), result]))
            .catch((error) => resolve([new PromiseError(error), undefined]));
    });
}

export function silentCallback<T>(fn: (callback: Callback<T>) => any | void, bind?: any): () => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, T>(fn: (arg1: A1, callback: Callback<T>) => any | void, bind?: any): (arg1: A1) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, T>(fn: (arg1: A1, arg2: A2, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, T>(fn: (arg1: A1, arg2: A2, arg3: A3, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, A5, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, A5, A6, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, A5, A6, A7, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, A5, A6, A7, A8, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, A5, A6, A7, A8, A9, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, arg9: A9, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, arg9: A9) => SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function silentCallback<A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, T>(fn: (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, arg9: A9, arg10: A10, callback: Callback<T>) => any | void, bind?: any): (arg1: A1, arg2: A2, arg3: A3, arg4: A4, arg5: A5, arg6: A6, arg7: A7, arg8: A8, arg9: A9, arg10: A10) => SilentPromise<T>;

// above functions into 1 - wraps fn into a function that returns SilentPromise (SilentPromiseFunction)
export function silentCallback<T>(fn: RestArgumentFunction, bindArg?: any): SilentPromiseFunction<T> {
    const wrapFn = getSilentPromiseFunction(fn, getBindArgument(bindArg) || bindArg);
    Object.setPrototypeOf(wrapFn, Object.getPrototypeOf(fn));
    return Object.defineProperties(wrapFn, getObjectPropertyDescriptors(fn));
}

export function execSilentCallback<T>(fn: RestArgumentFunction, bind: any): SilentPromiseFunction<T>;
export function execSilentCallback<T>(fn: RestArgumentFunction, ...args: any[]): SilentPromise<T>;
// tslint:disable-next-line:max-line-length
export function execSilentCallback<T>(fn: RestArgumentFunction, ...args: any[]): SilentPromise<T> | SilentPromiseFunction<T> {
    const bindArgs = getBindArgument(...args);
    if (bindArgs) {
        return getSilentPromiseFunction<T>(fn, bindArgs);
    } else {
        return new Promise((resolve) => {
            // append callback to intended function call
            args.push((error: any, result: T) => {
                if (error) {
                    resolve([ new PromiseError(error), undefined ]);
                } else {
                    resolve([ new PromiseError(), result ]);
                }
            });

            fn.call(this, ...args);
        });
    }
}

function getBindArgument(...args: any[]) {
    // must be the only argument
    if (args.length === 1 && args[0] instanceof Object && args[0][bind]) {
        return args[0][bind];
    }
}

function getSilentPromiseFunction<T>(fn: RestArgumentFunction, bindArg?: any) {
    return (...args: any[]): SilentPromise<T> => {
        return new Promise((resolve) => {
            try {
                fn.call(bindArg ? bindArg : this, ...args, (error: any | undefined, result: T) => {
                    if (error) {
                        resolve([new PromiseError(error), undefined]);
                    } else {
                        resolve([new PromiseError(), result]);
                    }
                });
            } catch (error) {
                resolve([new PromiseError(error), undefined]);
            }
        });
    };
}
