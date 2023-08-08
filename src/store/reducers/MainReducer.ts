import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DjangoFieldType, ConnectionType, DjangoClassType} from "../../models/IDjangoModels";


interface IMainSlice {
    djangoClass: DjangoClassType[]
    djangoFields: DjangoFieldType[]
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
            let indexes: number[] = []
            state.djangoFields.filter(val => val.parent_class_name === payload).forEach(val => {
                if (['ForeignKey'].includes(val.type)) indexes.push(state.djangoFields.findIndex(v => v.id === val.key_id))
                if (['key'].includes(val.type)) {
                    state.djangoFields = state.djangoFields.map(v => v.id === val.field_id ? {
                        ...v,
                        key_id: undefined,
                        class_name: undefined
                    } : v)
                }
            })
            state.djangoFields = state.djangoFields.filter((val, i) => val.parent_class_name !== payload && !indexes.includes(i))
        },
        changeClassName: (state, {payload}) => {
            if (!state.djangoClass.some(val => payload.new_class_name === val.class_name)) {
                state.djangoClass = state.djangoClass.map(val => {
                    if (val.class_name === payload.class_name) val.class_name = payload.new_class_name
                    return val
                })
                state.djangoFields = state.djangoFields.map(val => {
                    if (val.parent_class_name === payload.class_name) val.parent_class_name = payload.new_class_name
                    return val
                })
            }
        },
        addField: (state, {payload}: PayloadAction<DjangoFieldType>) => {
            if (!state.djangoFields.some(val => val.parent_class_name === payload.parent_class_name && val.field_name === payload.field_name)) {
                state.djangoFields = [...state.djangoFields, payload]
            }
        },
        updateField: (state, {payload}: PayloadAction<DjangoFieldType>) => {
            state.djangoFields = state.djangoFields.map(val => {
                if (val.id === payload.id) {
                    return {...payload}
                }
                return val
            })
        },
        deleteField: (state, {payload}: PayloadAction<DjangoFieldType>) => {
            if (payload.field_id) {
                state.djangoFields = state.djangoFields.map(val => val.id === payload.field_id ? {
                    ...val,
                    key_id: undefined,
                    class_name: undefined
                } : val)
            }
            state.djangoFields = state.djangoFields.filter(val => val.id !== payload.id && val.id !== payload.key_id)
        },
        addConnection: (state, {
            payload: {field, key}
        }: PayloadAction<{ field: DjangoFieldType, key: DjangoFieldType }>) => {
            if (state.djangoFields.some(val => val.parent_class_name === key.parent_class_name && val.field_name === key.field_name)) return
            if (field.key_id) {
                state.djangoFields = state.djangoFields.map(val => val.id === field.key_id ? key : val)
            } else {
                state.djangoFields = [...state.djangoFields, key]
            }
            state.djangoFields = state.djangoFields.map(val => {
                if (val.id === field.id) return {...field, class_name: key.parent_class_name, key_id: key.id}
                return val
            })

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
    changeClassName,
} = mainSlice.actions
export default mainSlice.reducer