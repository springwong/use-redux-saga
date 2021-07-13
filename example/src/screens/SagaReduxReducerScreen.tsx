import axios from "axios";
import React, { FC, useContext, useEffect, useReducer, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { call, delay, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { useRedux, useSaga, useSagaSimple } from "use-redux-saga";
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
    </View>
}
