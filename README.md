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
The way to insert reducer is based on [react redux document - code splitting](https://redux.js.org/usage/code-splitting).

P.S. createReducerManager and setRunSaga have zero dependencies. If you are aiming to use only one of them. you could simply ingore another init method.

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

#### useReduxReducer<S = any, A = any>(reducer: Reducer<S, A>, key: string, cleanUp: boolean = false): [S]
|params|Description|
|----|----|
|reducer|Reducer Type of react redux|
|key|The reducer key for combinedReducers. The reducer will keep alive if cleanUp = false and cannot recreated.|
|cleanUp|Default false, automatically remove reducer when FC destoryed if true.|
|Return|Description|
|S|The state of reducer|

```javascript
const SomeScreen: FC = () => {
    const [state] = useReduxReducer((state = {
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
    const [state] = useReduxReducer(someReducer, "UniqueKey");
    return <Text>{state.value}</Text>
}
```

#### useReduxReducerLocal<S = any, A = any>(reducer: Reducer<S, A>): [S]
|params|Description|
|----|----|
|reducer|Reducer Type of react redux|
|Return|Description|
|S|The state of reducer|

Same as useReduxReducer with auto generated key. Reducer will be removed if FC object is destoryed.

### useSaga
useSaga will always be destroyed when FC is destoryed. Use useContext Provider to make every events in single location.

#### Attentions
The useState variable inside generator will not be updated when everytime called. The problem is that if you use useState variable directly inside, you may get unexpected value and result.
To resolve it, it could pass the latest useState value when dispatch by useDispatch.
useSagaSimple provided useStateVariables variables to pass those values in useStateVariables with code hints.
Please note that the values of useState variable is locked when passed to generator function. If that value is changed in the middle of saga, the value cannot be reflected. For example, after an API call, and useState value is changed during the call.

#### useSaga<Type>(rootSaga: (sages: Type) => Generator, saga: Type): () => void
|params|Description|
|----|----|
|rootSaga|the root Saga|
|saga|sub sagas that will pass to rootSaga as parameter|
|Return|Description|
|()=>void|Call to cancel this saga immediately|

```javascript
// sample to run saga in run time
    const cancelSaga = useSaga(function*(params: any) {
        yield takeLatest("TEST_1", params.add)
    }, {
        add: function* () {
            yield delay(1000)
            yield put({
                type: 'provider_add'
            })
        },
    })
    
    // ... in some cases, call cancelSaga() to stop the saga actions manually
    // cancelSaga is not necessary is most use case.
```

or 
```javascript
// demoSaga is normal saga file with exported default. No params required in this case.
useSaga(demoSaga, {})
```

#### useSagaSimple<Type>(saga: (sages: {type: string, payload: any, useStateVariables: Type}) => Generator, useStateVariables: Type, effect: any = takeLatest): [((payload: any) => void), () => void]
useSagaSimple is a simple saga implementation with only one generator function. Effect will affect the behaviour when triggered.
Always use dispatchPayload to trigger this saga.

|params|Description|
|----|----|
|saga|saga generator method to run|
|useStateVariables|useState variable that passed to function, function* will not keep variable update from useState. So, to make sure the value is most updated in saga call, the value is passed in action.useStateVariables, no default but could pass {}|
|effect|any saga effect that take actions by different behaviour|
|Return|Description|
|((payload: any) => void)|Dispatch method with payload parameter|
|()=>void|Call to cancel this saga immediately|

```javascript
    const [dispatchPayload, cancelSaga]: [(payload: any) => void, () => void] = useSagaSimple(function* (payload: any) {
        yield delay(1000)
        yield put({
            type: 'provider_add'
        })
    }, {});

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
|actions|An object to process each return like normal reducer, 2nd param is payload but not action, action.type is hidden here which is object's key|
|Return|Description|
|state: StateType|Current state of useRedux|
|dispatches|The object that could trigger reducer, it's 1-to-1 mapping with input param actions|

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
    return <UseReduxProvider.Provider value={{
        state,
        dispatches,
    }} >
       {
           //... Other Components
       }
    </UseReduxProvider.Provider>
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
