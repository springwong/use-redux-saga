import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Task } from "redux-saga";
import { takeLatest } from "redux-saga/effects";
import { useDispatch } from "react-redux";
import { runSaga } from "./sagaManager";

export function useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type): () => void {
    if (!runSaga) {
        console.warn("useSaga without init setRunSaga");
    }
    const ref = useRef<Task>();
    if (!ref.current) {
        ref.current = runSaga(rootSaga, saga);
    }
    const cancelSaga = () => {
        if (ref.current) {
            ref.current.cancel();
        }
    }

    useEffect(() => {
        if (!ref.current) {
            ref.current = runSaga(rootSaga, saga);
        }
        if (ref.current && ref.current.isCancelled()) {
            ref.current = runSaga(rootSaga, saga);
        }
    }, []);

    useEffect(() => {
        return () => { 
            // clean up
            cancelSaga();
        }
    }, []);

    return cancelSaga;
}

export function useSagaSimple<Type>(saga: (sages: {type: string, payload: any, useStateVariables: Type}) => Generator, useStateVariables: Type, effect: any = takeLatest): [((payload: any) => void), () => void] {
    const keyRef = useRef<string>();
    if(!keyRef.current) {
        keyRef.current = uuidv4();
    }
    const cancelSaga = useSaga(function* (saga) {
        yield effect(keyRef.current, saga);
    }, saga);

    const dispatch = useDispatch();
    const dispatchPayload = (payload?: any) => {
        dispatch({
            type: keyRef.current,
            payload,
            useStateVariables,
        })
    }

    return [dispatchPayload, cancelSaga];
}

// export function useSagaEffect<Type>(saga: (sages: Type) => Generator, effect: any = takeLatest, deps: Array<any> = [], blockInitCall: boolean = false): [Task, ((payload: any) => void)] {
//     const [task, dispatchPayload] = useSagaSimple<Type>(effect, saga);

//     const [block, setBlock] = useState(blockInitCall);
//     useEffect(() => {
//         if (block) {
//             setBlock(false);
//             return;
//         }
//         dispatchPayload({})
//     }, deps);

//     return [task, dispatchPayload];
// }

