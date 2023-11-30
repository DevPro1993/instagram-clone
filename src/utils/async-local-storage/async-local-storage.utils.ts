import { AsyncLocalStorage } from "async_hooks";
import AsyncStore from "./async-store.type";



export default class AsyncLocalStorageUtils {

    private static instance = new AsyncLocalStorage();

    static init(cb: () => unknown) {
        const store = new Map<string, any>();
        AsyncLocalStorageUtils.instance.run(store, cb)
    }


    static getLoggedInUserId(): number {
        const store = AsyncLocalStorageUtils.getStore();
        return (store.get('sessionInfo'))?.id
    }

    static set(key: string, value: any, cb: () => unknown) {
        const store = AsyncLocalStorageUtils.getStore();
        store.set(key, value);
        AsyncLocalStorageUtils.instance.run(store, cb)
    }

    static get(key: string): any {
        const store = AsyncLocalStorageUtils.getStore();
        return store.get(key);
    }


    private static getStore = () => AsyncLocalStorageUtils.instance.getStore() as AsyncStore;

}