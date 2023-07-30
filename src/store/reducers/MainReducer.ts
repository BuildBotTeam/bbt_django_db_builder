import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ConnectionType, DjangoClassType} from "../../models/IDjangoModels";


interface IMainSlice {
    djangoClass: DjangoClassType[]
    connections: ConnectionType[]
}

const initialState: IMainSlice = {
    djangoClass: [],
    connections: []
}

export const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        addClass: (state, {payload}: PayloadAction<DjangoClassType>) => {
            if (!state.djangoClass.some(val => payload.class_name === val.class_name)) {
                state.djangoClass = [...state.djangoClass, payload]
            }
        },
        updateClass: (state, {payload}: PayloadAction<DjangoClassType>) => {
            state.djangoClass = state.djangoClass.map(val => val.class_name === payload.class_name ? payload : val)
        },
        deleteClass: (state, {payload}: PayloadAction<string>) => {
            state.djangoClass = state.djangoClass.filter(val => val.class_name !== payload)
        }
    },
})

export const {addClass, updateClass, deleteClass} = mainSlice.actions
export default mainSlice.reducer