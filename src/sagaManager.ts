type SagaManager = {
    logSaga: () => void;
    addSaga: (key: string, saga: any, params: any) => void,
    removeSaga: (key: string) => void;
}

export let sagaManager: SagaManager | undefined = undefined;

export function createSagaManager(runSaga: any, rootSaga: Generator): SagaManager { // Create a dictionary to keep track of injected sagas
    const injectedSagas = new Map();

    const isInjected = (key: string) => injectedSagas.has(key);

    const addSaga = (key: string, saga: any, params: any) => { // We won't run saga if it is already injected
        if (isInjected(key))
            return;

        // Sagas return task when they executed, which can be used
        // to cancel them
        const task = runSaga(saga, params);

        // Save the task if we want to cancel it in the future
        injectedSagas.set(key, task);
    };

    const removeSaga = (key: string) => { // We won't run saga if it is already injected
        if (!isInjected(key))
            return;

        const task = injectedSagas.get(key);
        task.cancel();

        injectedSagas.delete(key)
    };

    const logSaga = () => {
        injectedSagas.forEach((_value, _key, _map) => {
            console.log(_key)
        })
    }

    // Inject the root saga as it a staticlly loaded file,
    addSaga('root', rootSaga, {});

    sagaManager = {
        addSaga,
        removeSaga,
        logSaga
    };
    return sagaManager;
}
