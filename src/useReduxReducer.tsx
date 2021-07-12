import { Reducer, useEffect, useRef } from 'react';
import { useSelector, useStore } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { reducerManager } from './reducerManager';

export function useReduxReducer<S = any, A = any>(reducer: Reducer<S, A>, key: string, cleanUp: boolean = false): [S] {
    if (!reducerManager) {
        console.warn("useReduxReducer without init reducerManager");
    }
    const store = useStore();
    reducerManager?.addReducer(key, reducer, store);
    const state: S = useSelector((state: any) => state[key]);
    useEffect(() => {
        return () => { // clean up
            if (cleanUp) {
                reducerManager?.removeReducer(key, store)
            }
        }
    }, []);
    return [state];
}

export function useReduxReducerLocal<S = any, A = any>(reducer: Reducer<S, A>): [S] {
    const keyRef = useRef(uuidv4());
    return useReduxReducer(reducer, keyRef.current, true,)
}
