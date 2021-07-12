import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useRedux, useReduxReducerLocal } from "use-redux-saga";
import { LandingScreen } from "./src/screens/LandingScreen";
import { ReduxReducerScreen } from "./src/screens/ReduxReducerScreen";
import { ReduxSagaScreen } from "./src/screens/ReduxSagaScreen";
import { ReduxScreen } from "./src/screens/ReduxScreen";


export const ReducerProvider = React.createContext<[any, React.Dispatch<any>] | undefined>(undefined);
const Stack = createStackNavigator();

export const UseReduxProvider = React.createContext({
    state: {value: 0},
    dispatches: {multiple: (payload: any) => {}},
})

export const Container = () => {
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
    const reduxReducer = useReduxReducerLocal((state = {
        value: 0
    }, action : any) => {
        switch (action.type) {
            case 'provider_add':
                return {
                    ...state,
                    value: state.value + 1
                };
            case 'provider_minus':
                return {
                    ...state,
                    value: state.value - 1
                };
        }
        return state;
    });

    return <UseReduxProvider.Provider value={{
        state,
        dispatches,
    }} >
    <ReducerProvider.Provider value={reduxReducer}>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name={LandingScreen.name} component={LandingScreen} />
                <Stack.Screen name={ReduxReducerScreen.name} component={ReduxReducerScreen} />
                <Stack.Screen name={"Duplicate ReduxReducerScreen"} component={ReduxReducerScreen} />
                <Stack.Screen name={ReduxSagaScreen.name} component={ReduxSagaScreen} />
                <Stack.Screen name={ReduxScreen.name} component={ReduxScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    </ReducerProvider.Provider>
    </UseReduxProvider.Provider>
}