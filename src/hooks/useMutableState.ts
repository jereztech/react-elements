import { useState } from "react";

export default function useMutableState<S>(initialState: S | (() => S)): [S, (patch: Partial<S>) => void] {
    const [state, setState] = useState(initialState);
    const mutateState = (patch: Partial<S>) => setState(
        (currentState) => ({ ...currentState, ...patch })
    );
    return [state, mutateState];
}