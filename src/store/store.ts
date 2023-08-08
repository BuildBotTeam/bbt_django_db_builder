import {AnyAction, combineReducers, configureStore} from "@reduxjs/toolkit";
import mainReducer from './reducers/MainReducer'

const rootReducer = combineReducers({
    mainReducer
})

const reducerProxy = (state: any, action: AnyAction) => {
    return rootReducer(state, action);
}

export const setupStore = () => {
    return configureStore({
        reducer: reducerProxy,
        middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']