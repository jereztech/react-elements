import { useCallback, useRef, useState } from "react";

/**
 * State hook that merges partial updates into the current state,
 * plus a stable `reset` back to the initial state.
 */
export default function useMutableState<S extends object>(
    initialState: S | (() => S)
): [S, (patch: Partial<S>) => void, () => void] {

    const [state, setState] = useState(initialState);
    const initialStateRef = useRef(state);

    const mutateState = useCallback((patch: Partial<S>) => {
        setState(prevState => ({ ...prevState, ...patch }));
    }, []);

    const resetState = useCallback(() => setState(initialStateRef.current), []);

    return [state, mutateState, resetState];
}
