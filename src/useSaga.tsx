import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Task } from "redux-saga";
import { takeLatest } from "redux-saga/effects";
import { useDispatch } from "react-redux";
import { runSaga } from "./sagaManager";

export function useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type) {
    if (!runSaga) {
        console.warn("useSaga without init sagaRun");
    }
    const ref = useRef<Task>();
    if (!ref.current) {
        ref.current = runSaga(rootSaga, saga);
    }

    useEffect(() => {
        if (!ref.current) {
            ref.current = runSaga(rootSaga, saga);
        }
        if (ref.current && ref.current.isCancelled()) {
            ref.current = runSaga(rootSaga, saga);
        }
    }, [])

    useEffect(() => {
        return () => { // clean up
            if (ref.current) {
                ref.current.cancel();
            }
        }
    }, []);

    return ref.current as Task;
}

export function useSagaSimple<Type>(saga: (sages: Type) => Generator, effect: any = takeLatest) {
    const keyRef = useRef<string>();
    if(!keyRef.current) {
        keyRef.current = uuidv4();
    }
    const task = useSaga(function* (saga) {
        yield effect(keyRef.current, saga);
    }, saga);

    const dispatch = useDispatch();
    const dispatchPayload = (payload: any) => {
        dispatch({
            type: keyRef.current,
            payload
        })
    }

    return [task, dispatchPayload];
}

export function useSagaEffect<Type>(saga: (sages: Type) => Generator, effect: any = takeLatest, deps: Array<any> = [], blockInitCall: boolean = false) {
    const [task, dispatchPayload] = useSagaSimple<Type>(effect, saga);

    const [block, setBlock] = useState(blockInitCall);
    useEffect(() => {
        if (block) {
            setBlock(false);
            return;
        }
        const _dispatchPayload = dispatchPayload as ((payload: any) => void);
        _dispatchPayload({})
    }, deps);

    return [task, dispatchPayload];
}

