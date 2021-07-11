import { Reducer } from 'react';
import {combineReducers, Store, CombinedState} from 'redux';
type ReducerManager = {
    getReducerMap: () => any;
    addReducer: (key : string, reducer : Reducer<any, any>, store: Store) => void,
    removeReducer: (key : string, store: Store) => void;
}

export let reducerManager: ReducerManager |undefined = undefined;

export function createReducerManager(initialReducers: any) { // Create an object which maps keys to reducers
    const reducers = {
        ... initialReducers
    };

    // Create the initial combinedReducer
    let combinedReducer: CombinedState<any> = combineReducers(reducers);

    // An array which is used to delete state keys when reducers are removed
    // let keysToRemove: Array<string> = [];

    reducerManager = {
        getReducerMap: () => reducers,

        // The root reducer function exposed by this object
        // This will be passed to the store
        // reduce: (state: any, action: any) => {
        //     // If any reducers have been removed, clean up their state first
        //     if (keysToRemove.length > 0) {
        //       state = { ...state }
        //       for (let key of keysToRemove) {
        //         delete state[key]
        //       }
        //       keysToRemove = []
        //     }

        //     // Delegate to the combined reducer
        //     return combinedReducer(state, action)
        // },

        // Adds a new reducer with the specified key
        addReducer: function<S = any, A = any>(key : string, reducer : Reducer<S,A>, store: Store) {
            if (!key || reducers[key]) {
                return;
            }

            // Add the reducer to the reducer mapping
            reducers[key] = reducer;

            // Generate a new combined reducer
            combinedReducer = combineReducers(reducers);
            store.replaceReducer(combinedReducer);
        },

        // Removes a reducer with the specified key
        removeReducer: (key : string, store: Store) => {
            if (!key || ! reducers[key]) {
                return;
            }

            // Remove it from the reducer mapping
            delete reducers[key];

            // Add the key to the list of keys to clean up
            // keysToRemove.push(key);

            // Generate a new combined reducer
            combinedReducer = combineReducers(reducers);
            store.replaceReducer(combinedReducer);
        }
    }

    return reducerManager;
}
