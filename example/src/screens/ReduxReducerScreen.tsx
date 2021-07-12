import React, { Dispatch, FC, useContext, useEffect, useReducer } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector, useStore } from "react-redux";
import { reducerManager, useReduxReducer, useReduxReducerLocal } from "use-redux-saga";
import { ReducerProvider } from "../../Container";
import { style } from "../../styles";
import demoReducer from "../reducers/demoReducer";

interface TestState {
    value: number
}

export const ReduxReducerScreen: FC = ({navigation}) => {
    const dispatch = useDispatch();
    const [state] = useReduxReducer<TestState>((state = {
        value: 0
    }, action : any) => {
        switch (action.type) {
            case 'add':
                return { 
                    ...state,
                    value: state.value + 1
                };
            case 'minus':
                return {
                    ...state,
                    value: state.value - 1
                };
        }
        return state;
    }, "Spring")
    
    const [singleState] = useReduxReducerLocal<TestState>((state = {
        value: 0
    }, action : any) => {
        switch (action.type) {
            case 'single_add':
                return {
                    ...state,
                    value: state.value + 1
                };
            case 'single_minus':
                return {
                    ...state,
                    value: state.value - 1
                };
        }
        return state;
    })

    const [testState] = useReduxReducerLocal<TestState>((state = {
        value: 0
    }, action : any) => {
        switch (action.type) {
            case 'test_add':
                return {
                    ...state,
                    value: state.value + 1
                };
            case 'test_minus':
                return {
                    ...state,
                    value: state.value - 1
                };
        }
        return state;
    })

    const [demoReState] = useReduxReducer(demoReducer, "Demo", false);
    const demoStateFromSelector = useSelector((state:any) => state["Demo"])

    const [globalState, globalDispatch]: any = useContext(ReducerProvider);

    return <View style={{
        padding: 16,
    }}>
        <Text style={style.displayText}> {`${ReduxReducerScreen.name}`} </Text>
        <Text style={style.displayText}>{`useReduxReducer Current value: ${state.value}`}</Text>
        {/* <Text>{`Current value: ${value}`}</Text> */}
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "add"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useReduxReducer Dispatch add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "minus"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useReduxReducer Dispatch minus`}</Text>
        </TouchableOpacity>
        <Text style={style.displayText}>{`1st useReduxSingleReducer Current value: ${singleState.value}`}</Text>
        <Text style={style.displayText}>{`2nd useReduxReducerLocal Current value: ${testState.value}`}</Text>
        {/* <Text>{`Current value: ${value}`}</Text> */}
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "single_add"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useReduxReducerLocal Dispatch add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "single_minus"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useReduxReducerLocal Dispatch minus`}</Text>
        </TouchableOpacity>
        <Text style={style.displayText}>{`Reducer Provider Current value: ${globalState.value}`}</Text>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "provider_add"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`ReducerProvider Dispatch add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "provider_minus"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`ReducerProvider Dispatch minus`}</Text>
        </TouchableOpacity>

        <Text style={style.displayText}>{`demoStateFromSelector state value: ${demoStateFromSelector}`}</Text>
        <Text style={style.displayText}>{`demoReducer state value: ${demoReState}`}</Text>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatch({
                type: "demo_add"
            })
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`demoReducer Dispatch add`}</Text>
        </TouchableOpacity>
    </View>
}
