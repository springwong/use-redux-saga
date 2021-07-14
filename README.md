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

## Limitation
For inline generator function in useSaga / useSagaSimple, there are some limitations on mixed up with react hook APIs.
This limitation is not due to library itself but internal property of generator function and react hook.

### useSaga inline function
Consider a implementation below in functional component.
```javascript
const Component: FC = () => {
    const [index, setIndex] = useState(0);
    const [testCall] = useSagaSimple(function* (action) {
        // it always return initState = 0
        console.log(`index directly from : ${index}`)
        // value change by click
        console.log(`index pass from dispatch: ${action.useStateVariables.index}`)
    }, {index});
    return <TouchableOpacity onPress={
            () => {
                // add a for index from useState
                setIndex(index + 1);
                testCall({});
            }
        } style={style.button}>
            <Text>{"Press to trigger saga"}</Text>
    </TouchableOpacity>
}
```
Index haven't change by clicks because useState update value with different ref. And generator function will create a snapshot of those values when first time creation.

To simplify the usage, useSagaSimple allow the object to pass through dispatch.
```
{index} as last parameter
get() with action.useStateVariables.index
```
However, unlike 'yield select' in normal redux saga, the value is decided when payload is dispatched. So, if value is changed during the call. The value will not be most updated values.
Consider the saga file in normal practice, 'yield select' is the more 'saga' way to fetch the latest state of reducer values.

Another examples to show alternative:
```javascript
const Component: FC = () => {
    const index = useRef(0);
    const [state, dispatches, reducerKey] = useRedux({value: 0}, {
        add: (state, payload) => { return { ...state, value: state.value + 1}},
    })
    const [testCall] = useSagaSimple(function* (action) {
        // it has most updated value when index.current change.
        console.log(`index directly from : ${index.current}`)
        // or, for any reducer
        const selectorValue = (yield select(state => {
            return state[reducerKey]['value']
        })) as number;
        // it has most updated value also from redux state
        console.log(`index directly from : ${selectorValue}`)

    return <TouchableOpacity onPress={
            () => {
                // add 1 for both ref and redux reducer
                dispatches.add({})
                index.current = index.current + 1;
                testCall({});
            }
        } style={style.button}>
            <Text>{"Press to trigger saga"}</Text>
    </TouchableOpacity>
}
```
useRef results in consistent value because it have consistent ref object in its ref. And ref itself do not change in FC lifecycle.
yield select is correct and normal way to retrieve reducer value which is safe to use whatever in saga file or inline function.

### Summary
|source|Expection|
|----|----|
|const [state] = useState()|State ref will be locked when create generator function. Value will not be changed inside generator function with setState function|
|const [state] = useReducer()|Same as useState, state ref can't be changed once created generator function|
|const state = useSelector()|Believe that it's same as useState. The reason here is output of useSelector will have ref change when value updated. However, that ref change cannot be updated inside generator function.|
|const dispatch = useDispatch();dispatch({type:'xxx', payload:'state from useState'});|Dispatched state will be a copy of state when action dispatched. The state change after action dispatch will not affect the state value in saga parameter. useSagaSimple is supported this way.|
|const value = yield select(s => s['name'].value;|The saga way to retrieve latest state value. The most updated value will be returned.|
|const ref = useRef(0); const state = ref.current;|The value will be updated if get from ref.current. However, useRef value change will not trigger screen rendering which is mentioned in react hook documentation. Not suggested to rely on useRef with saga logic as normal practice.|

## License
Copyright (c) 2021 Spring Wong.

Licensed under The MIT License (MIT).
