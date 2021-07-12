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

```
// Your reducers object before combinedReducers
const reducers = { todosReducer }

// ...
// Store.js / ts
// init with createReducerManager
createReducerManager(reducers)
```
### Redux Saga
```
const sagaMiddleware = createSagaMiddleware({
  sagaMonitor
});

// code to run sagaMiddleware after store creation
sagaMiddleware.run(mySaga);
// setRunSaga with sagaMiddleware.run
setRunSaga(sagaMiddleware.run);
```

## Usage Example
