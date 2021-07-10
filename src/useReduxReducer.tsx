import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { reducerManager } from './reducerManager';

export function useReduxReducer<Type>(reducer: ((state: Type, action: any) => Type), key: string = uuidv4(), cleanUp: boolean = false) {
    if (!reducerManager) {
        console.warn("useReduxReducer without init reducerManager");
    }
    reducerManager?.addReducer(key, reducer);
    const state = useSelector((state: any) => state[key]);
    const dispatch = useDispatch();
    useEffect(() => {
        return () => { // clean up
            if (cleanUp) {
                reducerManager?.removeReducer(key)
            }
        }
    }, []);
    return [state, dispatch] as const;
}
