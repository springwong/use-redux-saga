import axios from "axios";
import React, { FC, useContext, useEffect, useReducer, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { call, delay, put, select, take, takeEvery, takeLatest } from "redux-saga/effects";
import { useRedux, useReduxReducerLocal, useSaga, useSagaSimple, useStateRef } from "use-redux-saga";
import { ReducerProvider } from "../../Container";
import { style } from "../../styles";
import demoSaga from "../sagas/demoSaga";

export const RefSagaScreen: FC = ({navigation}) => {
    const ref = useRef(0);
    useEffect(() => {
        console.log("ref.current changed")
    }, [ref.current])

    const [refState, setRefState] = useStateRef(0);

    useEffect(() => {
        console.log(`refState changed: ${refState.current}`)
    }, [refState])

    useEffect(() => {
        console.log(`refState.current changed: ${refState.current}`)
    }, [refState.current])

    const [call] = useSagaSimple(function* () {
        console.log(`refState value inside generator: ${refState.current}`)
    } , {})

    return <View style={{
        padding: 16,
    }}>
        <Text style={style.displayText}> {`${RefSagaScreen.name}`} </Text>
        <Text style={style.displayText}>{`useRef value: ${ref.current}`}</Text>
        <TouchableOpacity onPress={
            () => {ref.current = ref.current + 1}
        } style={style.button}>
            <Text>{"Click to add ref.current += 1"}</Text>
        </TouchableOpacity>
        <Text style={style.displayText}>{`*Clicked but no response on UI which is expected as react hook documentation`}</Text>
        <Text style={style.displayText}>{`** ref.current add to useEffect dep array but no update which is mentioned also.`}</Text>
        <Text style={style.displayText}>{`useRef value: ${refState.current}`}</Text>
        <TouchableOpacity onPress={
            () => {
                setRefState(refState.current + 1);
                call({})
            }
        } style={style.button}>
            <Text>{"Click to setRefState += 1"}</Text>
        </TouchableOpacity>
        <Text style={style.displayText}>{`*useStateRef can update screen by button click`}</Text>
        <Text style={style.displayText}>{`**useEffect with stateRef.current also triggered`}</Text>
    </View>
}
