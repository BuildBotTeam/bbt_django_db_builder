import {Box, Button, IconButton, Stack, Tooltip, Typography} from '@mui/material';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDrag} from "react-dnd";
import {DjangoFieldType, ClassFieldTypes, DjangoClassType,} from "../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {addField, deleteField, updateField} from "../store/reducers/MainReducer";
import {useAppDispatch, useAppSelector} from "../hooks";
import {useNavigate, useParams} from "react-router-dom";
import {FormAutocompleteSelect, FormSelect, FormSwitch, FormTextField, MainPopover} from "./HOC";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import {getFieldPropsByType, getFieldString} from "../services/DjangoBuilder";


type ClassFieldsFormProps = {
    handleClose?(): void
}

export function ClassFieldsForm(props: ClassFieldsFormProps) {
    const {handleClose} = props
    const {control, handleSubmit, reset, watch} = useForm()
    const {djangoFields, djangoClass} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const {class_name, field_id} = useParams()
    const [selectType, setSelectType] = useState<keyof typeof ClassFieldTypes>('CharField')

    useEffect(() => {
        if (!djangoClass.some(v => v.class_name === class_name)) handleClose!()
    }, [class_name])

    useEffect(() => {
        if (field_id) reset(djangoFields.find(v => v.id!.toString() === field_id))
    }, [field_id])

    function onSubmit(values: any) {
        values.parent_class_name = class_name
        values.id = djangoFields.length + 1
        values.field_name = values.field_name.toLowerCase()
        dispatch(addField(values))
        handleClose!()
    }

    useEffect(() => {
        const subscription = watch((value, {name, type}) => {
            if ('type' === name) setSelectType(value.type)
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const formBuilder = useMemo(() => {
        return ClassFieldTypes[selectType].map(val => {
            switch (val.type) {
                case 'string':
                    return <FormTextField key={val.name} fieldName={val.name} label={val.name} control={control}
                                          required={val.required}/>
                case 'number':
                    return <FormTextField key={val.name} fieldName={val.name} label={val.name} control={control}
                                          required={val.required} number/>
                case 'bool':
                    return <FormSwitch key={val.name} fieldName={val.name} label={val.name} control={control}
                                       required={val.required}/>
                case 'select':
                    return <FormSelect key={val.name} fieldName={val.name} label={val.name} control={control}
                                       required={val.required}
                                       searchList={val.list || []}/>
                default:
                    return null
            }
        })
    }, [selectType])

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1} sx={{pt: 1}}>
            <FormAutocompleteSelect fieldName={'type'} label={'Тип'} control={control}
                                    searchList={Object.keys(ClassFieldTypes)} required/>
            <FormTextField fieldName={'field_name'} label={'field_name'} control={control} required
                           inputProps={{pattern: "[A-Za-z_]*$"}}/>
            {formBuilder}
            <Button type={'submit'} variant={'contained'}>Создать</Button>
        </Stack>
    </form>
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
    const navigate = useNavigate()
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

    const tooltipContent = useMemo(() => {
        if (field.type === 'key') return null
        return <Box sx={{display: 'flex'}}>
            <Typography variant={"caption"}>({getFieldPropsByType(field).map(v => v)})</Typography>
        </Box>
    }, [field])

    return <Tooltip title={tooltipContent} placement="bottom">
        <Box sx={{display: 'flex', gap: 5, justifyContent: 'space-between', alignItems: 'center'}} ref={refBody}>
            <Stack direction={'row'}>
                <Stack direction={'row'}>
                    <IconButton size={'small'} onClick={() => dispatch(deleteField(field))}>
                        <ClearIcon sx={{fontSize: 16}}/>
                    </IconButton>
                    <IconButton size={'small'}
                                onClick={() => navigate(`field/${parentClass.class_name}/${field.id}/edit`)}>
                        <EditIcon sx={{fontSize: 16}}/>
                    </IconButton>
                </Stack>
                <Typography>{field_name}</Typography>
            </Stack>
            {<Typography>{type}</Typography>}
            {connect}
        </Box>
    </Tooltip>
}
