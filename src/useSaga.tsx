import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { sagaManager } from './sagaManager';

export function useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type, key: string = uuidv4(), cleanUp: boolean = true) {
    sagaManager?.addSaga(key, rootSaga, saga);
    const dispatch = useDispatch()

    const removeSaga = () => {
        sagaManager?.removeSaga(key)
    }
    useEffect(() => {
        return () => { // clean up
            if (cleanUp) {
                removeSaga();
            }
        }
    }, []);

    return [key, dispatch, removeSaga] as const
}

export function useSingleSaga<Type>(effect: any, saga: (sages: Type) => Generator, key: string = uuidv4(), cleanUp: boolean = true) {
    const [uniqueID, dispatch, removeSaga] = useSaga(function* (saga) {
        yield effect(key, saga);
    }, saga, key, cleanUp);

    const dispatchPayload = (payload: any) => {
        dispatch({
            type: key,
            payload
        })
    }

    return [uniqueID, dispatch, removeSaga, dispatchPayload] as const;
}

export function useEffectSaga<Type>(effect: any, saga: (sages: Type) => Generator, deps: Array<any> = [], blockInitCall: boolean = false, key: string = uuidv4(), cleanUp: boolean = true) {
    const [uniqueID, dispatch, dispatchPayload, removeSaga] = useSingleSaga<Type>(effect, saga, key, cleanUp);

    const [block, setBlock] = useState(blockInitCall);
    useEffect(() => {
        if (block) {
            setBlock(false);
            return;
        }
        dispatch({
            type: key,
            payload: {}
        })
    }, deps);

    return [uniqueID, dispatch, removeSaga, dispatchPayload] as const;
}
