import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ClassFieldsType, ConnectionType, DjangoClassType} from "../../models/IDjangoModels";
import React from "react";


interface IMainSlice {
    djangoClass: DjangoClassType[]
    djangoFields: ClassFieldsType[]
    connections: ConnectionType[]
}

const initialState: IMainSlice = {
    djangoClass: [],
    djangoFields: [],
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
        },
        addField: (state, {payload}) => {
            state.djangoFields = [...state.djangoFields, payload]
        },
        updateField: (state, {payload}: PayloadAction<ClassFieldsType>) => {
            state.djangoFields = [...state.djangoFields.map(val => {
                if (val.id === payload.id) {
                    return {...payload}
                }
                return val
            })]
        },
        addConnection: (state, {payload}: PayloadAction<any>) => {
            if (!state.djangoFields.some(val => val.id === payload.newField.id)) {
                state.djangoFields = state.djangoFields.map(val => {
                    if (val.id === payload.parent_id) {
                        val.key_id = payload.newField.id
                    }
                    return val
                })
                state.djangoFields = [...state.djangoFields, payload.newField]
            }
        }
    },
})

export const {addClass, updateClass, deleteClass, addField, updateField, addConnection} = mainSlice.actions
export default mainSlice.reducer