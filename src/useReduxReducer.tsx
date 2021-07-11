import { Reducer, useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { reducerManager } from './reducerManager';

export function useReduxReducer<S = any, A = any>(reducer: Reducer<S, A>, key: string = uuidv4(), cleanUp: boolean = false) {
    if (!reducerManager) {
        console.warn("useReduxReducer without init reducerManager");
    }
    const store = useStore();
    reducerManager?.addReducer(key, reducer, store);
    const state: S = useSelector((state: any) => state[key]);
    const dispatch = useDispatch();
    useEffect(() => {
        return () => { // clean up
            if (cleanUp) {
                reducerManager?.removeReducer(key, store)
            }
        }
    }, []);
    return [ state, dispatch ] as const;
}
