import React, { FC, useContext, useEffect, useReducer } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { delay, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import { useSaga, useSagaSimple } from "use-redux-saga";
import { ReducerProvider } from "../../Container";
import { style } from "../../styles";
import demoSaga from "../sagas/demoSaga";

interface TestState {
    value: number
}
export const ReduxSagaScreen: FC = ({navigation}) => {
    const dispatch = useDispatch();
    useSaga(function*(params: any) {
        yield takeLatest("TEST_1", params.add)
        yield takeLatest("TEST_2", params.minus)
    }, {
        add: function* () {
            yield delay(1000)
            yield put({
                type: 'provider_add'
            })
        },
        minus: function* () {
            yield delay(1000)
            yield put({
                type: 'provider_minus'
            })
        }
    })
    const [takeLatestDispatch] = useSagaSimple(function* () {
        yield delay(1000)
        yield put({
            type: 'provider_add'
        })
    }, {});

    const [takeEveryDispatch] = useSagaSimple(function* () {
        yield delay(1000)
        yield put({
            type: 'provider_add'
        })
    }, {}, takeEvery);

    const cancelDemoSaga = useSaga(demoSaga, {});

    const [globalState] = useContext(ReducerProvider) as [any];

    return <View style={{
        padding: 16,
    }}>
        <Text style={style.displayText}> {`${ReduxSagaScreen.name}`} </Text>
        <Text style={style.displayText}>{`globalState Current value: ${globalState.value}`}</Text>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "TEST_1"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`Dispatch Delay takeLatest add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "TEST_2"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`Dispatch Delay takeLatest minus`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            takeLatestDispatch({})
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`Dispatch with useSagaSimple takeLatest add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            takeEveryDispatch({})
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`Dispatch with useSagaSimple takeEvery add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "demoSaga_action"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`Dispatch demoSaga action, console log trigger`}</Text>
        </TouchableOpacity>
    </View>
}
