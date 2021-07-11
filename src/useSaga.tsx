import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { sagaManager } from './sagaManager';

export function useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type, key: string = uuidv4(), cleanUp: boolean = true) {
    sagaManager?.addSaga(key, rootSaga, saga);

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

    return { key, removeSaga }
}

export function useSingleSaga<Type>(effect: any, saga: (sages: Type) => Generator, key: string = uuidv4(), cleanUp: boolean = true) {
    const { removeSaga } = useSaga(function* (saga) {
        yield effect(key, saga);
    }, saga, key, cleanUp);

    const dispatch = useDispatch();

    const dispatchPayload = (payload: any) => {
        dispatch({
            type: key,
            payload
        })
    }

    return { key, removeSaga, dispatchPayload };
}

export function useEffectSaga<Type>(effect: any, saga: (sages: Type) => Generator, deps: Array<any> = [], blockInitCall: boolean = false, key: string = uuidv4(), cleanUp: boolean = true) {
    const { dispatchPayload, removeSaga } = useSingleSaga<Type>(effect, saga, key, cleanUp);

    const dispatch = useDispatch();
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

    return { key, removeSaga, dispatchPayload };
}
