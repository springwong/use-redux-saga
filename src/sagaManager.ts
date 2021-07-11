
// type SagaManager = {
//     logSaga: () => void;
//     addSaga: (key: string, saga: (params: any) => Generator, params: any) => void,
//     removeSaga: (key: string) => void;
// }

export let runSaga: any = undefined;
export function setRunSaga(middlewareRun: any) {
    runSaga = middlewareRun;
}
// export let sagaManager: SagaManager | undefined = undefined;

// export function createSagaManager(runSaga: any, rootSaga: () => Generator, runSagaParams: any = {}): SagaManager { // Create a dictionary to keep track of injected sagas
//     const sagas: any = {};

//     const isInjected = (key: string) => key in sagas;

//     const addSaga = (key: string, saga: (params: any) => Generator, params: any) => { // We won't run saga if it is already injected
//         if (isInjected(key))
//             return;

//         // Sagas return task when they executed, which can be used
//         // to cancel them
//         const task = runSaga(saga, params);

//         // Save the task if we want to cancel it in the future
//         sagas[key] = task;
//     };

//     const removeSaga = (key: string) => { // We won't run saga if it is already injected
//         if (!isInjected(key))
//             return;

//         const task = sagas[key];
//         task.cancel();

//         delete sagas[key];
//     };

//     const logSaga = () => {
//         Object.keys(sagas).forEach(key => {
//             console.log(key);
//         });
//     }

//     // Inject the root saga as it a staticlly loaded file,
//     addSaga('root', rootSaga, runSagaParams);

//     sagaManager = {
//         addSaga,
//         removeSaga,
//         logSaga
//     };
//     return sagaManager;
// }
