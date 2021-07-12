useReduxSaga
=========================

A extension library for react hook + [react redux](https://github.com/reduxjs/react-redux) + [saga](https://redux-saga.js.org/)

`use-redux-saga` is a library to integrate redux and its side effect with react hook API with more advanced features.

The provided Hooks are trying to make reducer and saga aligning with the normal usage of hooks.

[![npm version](https://img.shields.io/npm/v/use-redux-saga.svg?style=flat-square)](https://www.npmjs.com/package/use-redux-saga)
[![npm downloads](https://img.shields.io/npm/dm/use-redux-saga.svg?style=flat-square)](https://www.npmjs.com/package/use-redux-saga)

## Installation

To use useReduxSaga with your React app, install it as a dependency:

```bash
# If you use npm:
npm install use-redux-saga

# Or if you use Yarn:
yarn add use-redux-saga
```
## Setup

### Reducers
`use-redux-saga` required to init with the static reducers before combinedReducers.
The way to insert reducer is based on [react redux document - code splitting](https://redux.js.org/usage/code-splitting)

```javascript
// Your reducers object before combinedReducers
const reducers = { todosReducer }

// ...
// Store.js / ts
// init with createReducerManager
createReducerManager(reducers)
```
### Redux Saga
```javascript
const sagaMiddleware = createSagaMiddleware({
  sagaMonitor
});

// code to run sagaMiddleware after store creation
sagaMiddleware.run(mySaga);
// setRunSaga with sagaMiddleware.run
setRunSaga(sagaMiddleware.run);
```

## Usage Example
### useReduxReducer

#### useReduxReducer<S = any, A = any>(reducer: Reducer<S, A>, key: string, cleanUp: boolean = false): [S, Dispatch<any>]
|params|Description|
|----|----|
|reducer|Reducer Type of react redux|
|key|The reducer key for combinedReducers. The reducer will keep alive if cleanUp = false and cannot recreated.|
|cleanUp|Default false, automatically remove reducer when FC destoryed if true.|

```javascript
const SomeScreen: FC = () => {
    const [state, dispatch] = useReduxReducer((state = {
        value: 0
    }, action : any) => {
        switch (action.type) {
            case 'add':
                return { 
                    ...state,
                    value: state.value + 1
                };
        }
        return state;
    }, "UniqueKey");
    return <Text>{state.value}</Text>
}
```
or
```javascript
const SomeScreen: FC = () => {
    // someReducer from normal reducer file.
    const [state, dispatch] = useReduxReducer(someReducer, "UniqueKey");
    return <Text>{state.value}</Text>
}
```

#### useReduxReducerLocal<S = any, A = any>(reducer: Reducer<S, A>): [S, Dispatch<any>]
|params|Description|
|----|----|
|reducer|Reducer Type of react redux|

Same as useReduxReducer with auto generated key. Reducer will be removed if FC object is destoryed.

### useSaga
useSaga will always be destroyed when FC is destoryed. Use useContext Provider to make every events in single location.

#### useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type): Task
|params|Description|
|----|----|
|rootSaga|the root Saga|
|saga|sub sagas that will pass to rootSaga as parameter|

```javascript
// sample to run saga in run time
    useSaga(function*(params: any) {
        yield takeLatest("TEST_1", params.add)
    }, {
        add: function* () {
            yield delay(1000)
            yield put({
                type: 'provider_add'
            })
        },
    })
```

or 
```javascript
// demoSaga is normal saga file with exported default. No params required in this case.
useSaga(demoSaga, {})
```

#### useSagaSimple<Type>(saga: (sages: Type) => Generator, effect: any = takeLatest): [Task, ((payload: any) => void)]
useSagaSimple is a simple saga implementation with only one generator function. Effect will affect the behaviour when triggered.
Always use dispatchPayload to trigger this saga.

```javascript
    const [task, dispatchPayload]: [Task, (payload: any) => void] = useSagaSimple(function* (payload: any) {
        yield delay(1000)
        yield put({
            type: 'provider_add'
        })
    });

    // ...
    return <View onPress={() => {
        dispatchPayload({
            value: 0
        })
    }} />
```

### useRedux
useRedux is a more advanced hook to generic action in redux

### useRedux<StateType, Actions extends { [id: string]: (state: StateType, payload: any) => StateType }>(initState: StateType, actions: Actions): [StateType, { [key in keyof Actions]: (payload: any) => void }]

|params|Description|
|----|----|
|state|init State|
|payload|An object to process each return like normal reducer, 2nd param is payload but not action, action.type is hidden here which is object's key|

```javascript
    const [state, dispatches] = useRedux({
        value: 0
    }, {
        add: (state, payload) => {
            return {
                ...state,
                value: state.value + 1
            }
        },
        minus: (state, payload) => {
            return {
                ...state,
                value: state.value - 1
            }
        },
    });

    // ...
    return <View onPress={() => {
        dispatches.add({
            // maybe some value
        })
    }} ><Text>{state.value}</Text> </View>
```

### reducerManager
Normally, don't need to get reducerManager object, but sometimes, you may need to remove reducer with removeReducer() method.
```javascript
interface {
    getReducerMap: () => any,
    addReducer: (key : string, reducer : Reducer<any, any>, store: Store) => void,
    removeReducer: (key : string, store: Store) => void,
}
```

### State accross screens
#### useContext Provider
```javascript
// container screen
export const UseReduxProvider = React.createContext({
    state: {value: 0},
    dispatches: {multiple: (payload: any) => {}},
})

const Container: FC = () => {
    const [state, dispatches] = useRedux({
        value: 2
    }, {
        multiple: (state, payload) => {
            return {
                ...state,
                value: state.value * 2,
            }
        }
    });
}

// another screen, useContext
const reduxConsumer = useContext(UseReduxProvider);
```

#### useReduxReducer with cleanUp = false
Reducer will not be duplicated if cleanUp = false.
Always can use useSelector to get the store value. Or, dispatch action with useDispatch in `react-redux` library.

useReduxReducer with same key will serve the 1st called function only.

Suggest to use reducer file approach in this case.
```javascript
const state = useSelector("YOUR_KEY")
```

## License
Copyright (c) 2021 Spring Wong.

Licensed under The MIT License (MIT).
