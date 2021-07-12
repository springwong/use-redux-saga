import { useEffect, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { reducerManager } from "./reducerManager";
import { v4 as uuidv4 } from 'uuid';

export function useRedux<StateType, Actions extends { [id: string]: (state: StateType, payload: any) => StateType }>(initState: StateType, actions: Actions): [StateType, { [key in keyof Actions]: (payload: any) => void }] {
    if (!reducerManager) {
        console.warn("useReduxReducer without init reducerManager");
    }
    const keyRef = useRef(uuidv4());
    const reducerKey = keyRef.current;
    const dispatches: { [key in keyof Actions]: (payload: any) => void } = {} as { [key in keyof Actions]: (payload: any) => void };
    const dispatch = useDispatch();
    const store = useStore();
    Object.keys(actions).forEach(key => {
        // @ts-ignore
        dispatches[key] = (payload: any) => {
            dispatch({
                type: key,
                payload,
            })
        };
    })
    const reducer = (state: StateType = initState, action: any) => {
        const type = action.type;
        const takeAction = actions[type];
        if (takeAction)
            return takeAction(state, action.payload)
        return state;
    }
    reducerManager?.addReducer(reducerKey, reducer, store);
    useEffect(() => {
        return () => {
            reducerManager?.removeReducer(reducerKey, store);
        }
    }, []);
    const reducerState = useSelector((state: any) => state[reducerKey]);
    return [reducerState, dispatches];
}