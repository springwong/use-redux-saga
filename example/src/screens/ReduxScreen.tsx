import React, { Dispatch, FC, useContext, useEffect, useReducer } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useStore } from "react-redux";
import { reducerManager, useRedux, useReduxReducer, useReduxReducerLocal } from "use-redux-saga";
import { ReducerProvider, UseReduxProvider } from "../../Container";
import { style } from "../../styles";

export const ReduxScreen: FC = ({navigation}) => {
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

    const reduxConsumer = useContext(UseReduxProvider);

    return <View style={{
        padding: 16,
    }}>
        <Text style={style.displayText}> {`${ReduxScreen.name}`} </Text>
        <Text style={style.displayText}>{`useRedux Current value: ${state.value}`}</Text>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatches.add()
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useRedux add`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            dispatches.minus()
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useRedux minus`}</Text>
        </TouchableOpacity>
        <Text style={style.displayText}>{`reduxConsumer Current value: ${reduxConsumer.state.value}`}</Text>
        <TouchableOpacity style={style.button} onPress={() => {
            reduxConsumer.dispatches.multiple()
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`reduxConsumer multiple`}</Text>
        </TouchableOpacity>
    </View>
}
