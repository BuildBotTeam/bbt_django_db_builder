import {Box, Button, IconButton, Stack, Typography} from '@mui/material';
import React, {useEffect, useMemo, useRef} from 'react';
import {useDrag} from "react-dnd";
import {DjangoFieldType, ClassFieldTypes, DjangoClassType, } from "../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {addField, deleteField, updateField} from "../store/reducers/MainReducer";
import {useAppDispatch, useAppSelector} from "../hooks";
import {useParams} from "react-router-dom";
import {FormAutocompleteSelect, FormTextField, MainPopover} from "./HOC";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ClearIcon from '@mui/icons-material/Clear';


type ClassFieldsFormProps = {
    handleClose?(): void
}

export function ClassFieldsForm(props: ClassFieldsFormProps) {
    const {handleClose} = props
    const {control, handleSubmit} = useForm()
    const {djangoFields} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const {class_name} = useParams()

    function onSubmit(values: any) {
        values.parent_class_name = class_name
        values.id = djangoFields.length + 1
        values.field_name = values.field_name.toLowerCase()
        dispatch(addField(values))
        handleClose!()
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1} sx={{pt: 1}}>
            <FormAutocompleteSelect fieldName={'type'} label={'Тип'} control={control}
                                    searchList={Object.keys(ClassFieldTypes)} required/>
            <FormTextField fieldName={'field_name'} label={'field_name'} control={control} required
                           inputProps={{pattern: "[A-Za-z_]*$"}}/>
            <FormTextField fieldName={'max_length'} label={'max_length'} control={control} required/>
            <Button type={'submit'} variant={'contained'}>Создать</Button>
        </Stack>
    </form>
}

type CharFieldDetailProps = {
    field: DjangoFieldType
}

export function CharFieldDetail({field}: CharFieldDetailProps) {
    const {class_name, max_length, on_delete, blank, tnull,tdefault,} = field
    return <div></div>
}

type ClassFieldProps = {
    field: DjangoFieldType
    parentClass: DjangoClassType
}

export default function ClassField(props: ClassFieldProps) {
    const {field, parentClass} = props
    const {type, field_name, key_id, dif_y,} = field
    const {djangoFields, djangoClass} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const refBody = useRef<HTMLDivElement | null>(null)

    const [, drag] = useDrag(
        () => ({
            type: 'item',
            item: field,
        }),
        [field],
    )

    useEffect(() => {
        if (!dif_y && refBody.current) {
            const rect = refBody.current?.getBoundingClientRect()
            dispatch(updateField({...field, dif_y: rect.y + rect.height / 2 - parentClass.pos.y}))
        }
    }, [field, djangoClass])

    const connect = useMemo(() => {
        if (type === 'ForeignKey') {
            return <div ref={drag} style={{cursor: 'grab', position: 'absolute', right: -10, paddingTop: 2}}>
                {key_id ? <RadioButtonCheckedIcon sx={{fontSize: 16}}/> :
                    <RadioButtonUncheckedIcon sx={{fontSize: 16}}/>}
            </div>

        }
        return null
    }, [field, refBody, djangoClass, djangoFields])

    return <Box sx={{display: 'flex', gap: 5, justifyContent: 'space-between', alignItems: 'center'}} ref={refBody}>
        <Stack direction={'row'}>
            <Box><IconButton size={'small'} onClick={() => dispatch(deleteField(field))}>
                <ClearIcon sx={{fontSize: 16}}/>
            </IconButton></Box>
            <Typography>{field_name}</Typography>
        </Stack>
        <MainPopover name={type}><Typography>sadasdas</Typography></MainPopover>
        {connect}
    </Box>
}
