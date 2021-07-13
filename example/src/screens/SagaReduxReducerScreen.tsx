import axios from "axios";
import React, { FC, useContext, useEffect, useReducer, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { call, delay, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { useRedux, useReduxReducerLocal, useSaga, useSagaSimple } from "use-redux-saga";
import { ReducerProvider } from "../../Container";
import { style } from "../../styles";
import demoSaga from "../sagas/demoSaga";

interface TestState {
    value: number
}
export const SagaReduxReducerScreen: FC = ({navigation}) => {

    const [value, setValue] = useState(0)
    const [state, dispatches, reducerKey] = useRedux({value: 0}, {
        add: (state, payload) => { return { ...state, value: state.value + 1}},
        minus: (state, payload) => { return { ...state, value: state.value - 1}},
    })
    const [addCall] = useSagaSimple(function* (action) {
        yield put({
            type: 'add',
        })
        const latestValue = (yield select(state => {
            return state[reducerKey]['value']
        })) as number;
        setValue(latestValue)
    }, {});
    const [minusCall] = useSagaSimple(function* (action) {
        yield put({
            type: 'minus',
        })
        const latestValue = (yield select(state => {
            return state[reducerKey]['value']
        })) as number;
        setValue(latestValue)
    }, {});

    const [index, setIndex] = useState(0);
    const indexRef = useRef(0)
    const [reduxReducerState, reduxReducerKey] = useReduxReducerLocal((state = {}, action) => {
        if (action.type === "TEST") {
            return action.payload;
        }
        return state;
    })

    const [testCall] = useSagaSimple(function* (action) {
        yield put({type: 'TEST', payload: {foo: `test value  ${action.useStateVariables.index}`}})
        indexRef.current = action.useStateVariables.index;
        const foo = yield select(s => s[reduxReducerKey].foo);
        yield delay(500)
        console.log('foo from selector, expect: latest value,', foo);
        console.log('foo from useState, expect: undefined,', reduxReducerState.foo);
        console.log('foo from saga action, undefined in beginning, expect: latest value - 1,', action.useStateVariables.reduxReducerState.foo);
        console.log('foo from useRef, expect: latest value,', indexRef.current);
    }, {reduxReducerState, index})

    return <View style={{
        padding: 16,
    }}>
        <Text style={style.displayText}> {`${SagaReduxReducerScreen.name}`} </Text>
        <Text style={style.displayText}>{`useRedux action is trigger in saga and expect to update useState with latest redux reducer value`}</Text>
        <Text style={style.displayText}>{`useRedux value: ${state.value}`}</Text>
        <Text style={style.displayText}>{`useState value: ${value}`}</Text>
        <TouchableOpacity onPress={
            () => {addCall({})}
        } style={style.button}>
            <Text>{"Press to add"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={
            () => {minusCall({})}
        } style={style.button}>
            <Text>{"Press to minus"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={
            () => {
                testCall({})
                setIndex(index+1)
            }
        } style={{
            ...style.button,
            marginTop: 40,
        }}>
            <Text>{"Dispatch to test 3 diff value source in sagas in console.log"}</Text>
        </TouchableOpacity>
        <Text style={style.displayText}>{`Delay 500 millisecond before console.log to prevent any data async issue except selector`}</Text>
        <Text style={style.displayText}>{`*value from useState is always undefined / unchange as ref not change since function created`}</Text>
        <Text style={style.displayText}>{`*value from saga action is lagged 1 behind selector, because its value is decided before action put`}</Text>
        <Text style={style.displayText}>{`*value from saga select get the latest expected value because it's sync with store`}</Text>
        <Text style={style.displayText}>{`*value from useRef is another way to always get the latest value from functional component.`}</Text>
    </View>
}
