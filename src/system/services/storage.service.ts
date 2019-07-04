import {Injectable} from '@angular/core';
import * as localForage from 'localforage';
import {STORAGE_NAME, STORE_DESCRIPTION, STORE_VERSION, STORE_NAME} from '../utilities/constants';

@Injectable({
    providedIn: 'root'
})
export class ForageService {

    forageOptions = {
        storeName: STORE_NAME,
        name: STORAGE_NAME,
        version: STORE_VERSION,
        description: STORE_DESCRIPTION
    };

    constructor() {
        //localForage.config(this.forageOptions);
    }

    /**
     * Local Get | Get data from local storage based on 'key'
     * @param {string} key
     * @returns {string}
     */
    localGet(key: string) {
        return localForage.getItem(key);
    }

    /**
     * Local Set | Set data in local storage based on 'key'
     * @param {{key: string; data: any}} obj
     */
    localSet(obj: { key: string, data: any }) {
        if (obj && obj.key) {
            return localForage.setItem(obj.key, obj.data);
        }
    }

    /**
     * Local Remove | Delete data from local storage based on 'key'
     * @param {string} key
     */
    localRemove(key: string) {
        return localForage.removeItem(key);
    }

    /**
     * Keys | Returns all keys in storage
     * @param cb
     * @returns {any}
     */
    keys(cb?) {
        return localForage.keys(cb);
    }

    /**
     * Local Clear | Clear the storage
     */
    localClear() {
        localForage.clear();
    }
}
