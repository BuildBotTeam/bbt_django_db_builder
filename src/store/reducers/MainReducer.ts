import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ClassFieldsType, ConnectionType, DjangoClassType} from "../../models/IDjangoModels";


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
            let keys: string[] = []
            state.djangoFields.filter(val => val.parent_class_name === payload && val.type === 'ForeignField').forEach(val => {
                state.djangoFields.forEach((v) => {
                    if (v.field_name === (val.related_name || val.field_name + '_set')) {
                        keys.push(v.field_name)
                    }
                })
            })
            state.djangoFields = state.djangoFields.filter(val => val.parent_class_name !== payload && !keys.includes(val.field_name))
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
        deleteField: (state, {payload}: PayloadAction<ClassFieldsType>) => {
            if (payload.type === 'ForeignField') {
                state.djangoFields = state.djangoFields.filter(val => !(val.field_name === (payload.related_name || payload.field_name + '_set')))
            }
            state.djangoFields = state.djangoFields.filter(val => val.id !== payload.id)
        },
        addConnection: (state, {payload}: PayloadAction<ClassFieldsType>) => {
            if (!state.djangoFields.some(val => val.parent_class_name === payload.parent_class_name && val.field_name === payload.field_name)) {
                state.djangoFields = [...state.djangoFields, payload]
            }
        },
    },
})

export const {
    addClass,
    updateClass,
    deleteClass,
    addField,
    updateField,
    addConnection,
    deleteField,
} = mainSlice.actions
export default mainSlice.reducer