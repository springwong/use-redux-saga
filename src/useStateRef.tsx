import { useRef, useState } from "react";

export function useStateRef<T>(initialState: T): [React.MutableRefObject<T> , (input: T) => void] {
    const ref = useRef<T>(initialState);
    const [dep, setDep] = useState(false);
    const setRef = (newState: T) => {
        ref.current = newState;
        setDep(!dep);
    }
    return [ref, setRef];
}