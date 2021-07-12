import {combineReducers} from 'redux'

function todosReducer(state = {
    count : 0
}, action : any) {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                count: state.count + 1
            }
        case 'minus':
            return {
                ...state,
                count: state.count - 1
            }
        default:
            return state
    }
}
export const reducers = {todosReducer}
const rootReducer = combineReducers(reducers)

export default rootReducer
