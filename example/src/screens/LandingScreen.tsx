import React, { FC, useContext, useEffect, useReducer } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { style } from "../../styles";
import { RefSagaScreen } from "./RefSagaScreen";
import { SagaApiScreen } from "./SagaApiScreen";
import { SagaReduxReducerScreen } from "./SagaReduxReducerScreen";

export const LandingScreen: FC = ({navigation}) => {

    return <View style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
    }}>
        <Text> {`${LandingScreen.name}`} </Text>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate("ReduxReducerScreen")
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useReduxReducer Screen`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate("Duplicate ReduxReducerScreen")
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`Separated useReduxReducer Screen`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate("ReduxSagaScreen")
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useSaga Screen`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate("ReduxScreen")
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`useRedux Screen`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate(SagaApiScreen.name)
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`SagaApiScreen Screen`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate(SagaReduxReducerScreen.name)
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`SagaReduxReducerScreen Screen`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.button} onPress={() => {
            navigation.navigate(RefSagaScreen.name)
        }}>
            <Text style={{
                alignSelf: "center",
            }}>{`RefSagaScreen Screen`}</Text>
        </TouchableOpacity>
    </View>
}