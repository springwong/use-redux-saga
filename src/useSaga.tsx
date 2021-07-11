import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { sagaManager } from './sagaManager';

export function useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type) {
    const keyRef = useRef(uuidv4());
    const key = keyRef.current;
    return useSaga2(rootSaga, saga, key, true)
}

export function useSaga2<Type>(rootSaga: (sages: Type) => Generator, saga: Type, uniqueKey: string = uuidv4(), cleanUp: boolean = true) {
    sagaManager?.addSaga(uniqueKey, rootSaga, saga);

    const removeSaga = () => {
        sagaManager?.removeSaga(uniqueKey)
    }
    useEffect(() => {
        return () => { // clean up
            if (cleanUp) {
                removeSaga();
            }
        }
    }, []);

    return [uniqueKey, removeSaga]
}

export function useSagaSimple<Type>(effect: any, saga: (sages: Type) => Generator) {
    const keyRef = useRef(uuidv4());
    const key = keyRef.current;
    const [_, removeSaga]= useSaga2(function* (saga) {
        yield effect(key, saga);
    }, saga, key, true);

    const dispatch = useDispatch();
    const dispatchPayload = (payload: any) => {
        dispatch({
            type: key,
            payload
        })
    }

    return [key, dispatchPayload, removeSaga];
}

export function useSagaEffect<Type>(effect: any, saga: (sages: Type) => Generator, deps: Array<any> = [], blockInitCall: boolean = false) {
    const [key, dispatchPayload, removeSaga] = useSagaSimple<Type>(effect, saga);

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

    return [key, dispatchPayload, removeSaga];
}
