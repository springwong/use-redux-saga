import axios from "axios";
import React, { FC, useContext, useEffect, useReducer, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { call, delay, put, take, takeEvery, takeLatest } from "redux-saga/effects";
import { useSaga, useSagaSimple } from "use-redux-saga";
import { ReducerProvider } from "../../Container";
import { style } from "../../styles";
import demoSaga from "../sagas/demoSaga";

interface TestState {
    value: number
}
export const SagaApiScreen: FC = ({navigation}) => {

    const [value, setValue] = useState<string>()
    const [dataSet, setDataSet] = useState<Array<any>>()
    const [listCall] = useSagaSimple(function* () {
        try {
            const res: any = yield call(axios.get, "https://jsonplaceholder.typicode.com/todos")
            console.log(res);
            setValue('API call success');
            setDataSet(res.data.slice(0,10));
        } catch (ex) {
            setValue('API call fail and catched')
        }
    }, {});
    useEffect(() => {
        // call saga when app init
        listCall({})
    }, []);

    const [detailCall] = useSagaSimple(function* (action) {
        console.log(action);
        try {
            const { id, index } = action.payload;
            const { dataSet } = action.useStateVariables;
            const res: any = yield call(axios.get, `https://jsonplaceholder.typicode.com/todos/${id + 1}`)
            console.log(res);
            const newDataSet = Array.from(dataSet as Array<any>);
            newDataSet[index] = res.data;
            setDataSet(newDataSet);
        } catch (ex) {
            console.log(ex)
            setValue('API call fail and catched')
        }
    },  { dataSet }, takeEvery);

    return <View style={{
        padding: 16,
    }}>
        <Text style={style.displayText}> {`${SagaApiScreen.name}`} </Text>
        <Text style={style.displayText}>{`In this list, clicked each button will load next ids detail API and replace the text`}</Text>
        {
            value ? <Text style={style.displayText}>{value}</Text> : <ActivityIndicator />
        }
        {
            dataSet?.slice(0,10).map((item, index) => {
                return <TouchableOpacity onPress={() => {
                    detailCall({
                        index,
                        id: item.id,
                    })
                }} style={{
                    padding: 8,
                    borderWidth: 1,
                    borderBottomColor: 'red'
                }}>
                    <Text>{item.title}</Text>
                </TouchableOpacity>
            })
        }
    </View>
}
