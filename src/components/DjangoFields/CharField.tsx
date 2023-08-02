import {Box, Button, Stack, Typography} from '@mui/material';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDrag, XYCoord} from "react-dnd";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {ClassFieldsType, ClassFieldTypeList, DjangoClassType, Point} from "../../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {addField, updateField} from "../../store/reducers/MainReducer";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useParams} from "react-router-dom";
import {FormSelect, FormTextField} from "../HOC";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {calculatePath} from "../../utils";


type ClassFieldsFormProps = {
    handleClose?(): void
}

export function ClassFieldsForm(props: ClassFieldsFormProps) {
    const {handleClose} = props
    const {control, handleSubmit} = useForm()
    const dispatch = useAppDispatch()
    const {class_name} = useParams()

    function onSubmit(values: any) {
        values.parent_class_name = class_name
        values.id = `${class_name}_${values.field_name}`
        dispatch(addField(values))
        handleClose!()
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1} sx={{pt: 1}}>
            <FormSelect fieldName={'type'} label={'Тип'} control={control} searchList={ClassFieldTypeList} required/>
            <FormTextField fieldName={'field_name'} label={'Название'} control={control} required
                           inputProps={{pattern: "[a-z_]*$"}}/>
            <Button type={'submit'} variant={'contained'}>Создать</Button>
        </Stack>
    </form>
}

type ClassFieldProps = {
    field: ClassFieldsType
    parentClass: DjangoClassType
}

export default function ClassField(props: ClassFieldProps) {
    const {field, parentClass} = props
    const {type, class_name, field_name, related_name, dif_y, on_delete, tnull, blank, parent_class_name} = field
    const {djangoFields, djangoClass} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const refBody = useRef<HTMLDivElement | null>(null)

    const [_, drag] = useDrag(
        () => ({
            type: 'item',
            item: {field_name, parent_class_name},
        }),
        [parent_class_name, field_name],
    )

    useEffect(() => {
        if (!dif_y && refBody.current) {
            const rect = refBody.current?.getBoundingClientRect()
            dispatch(updateField({...field, dif_y: rect.y + rect.height / 2 - parentClass.pos.y}))
        }
    }, [field, djangoClass])

    const body = useMemo(() => {
        if (type === 'ForeignField') {
            return <React.Fragment>
                <Typography>{field_name}</Typography>
                <Stack direction={'row'}>
                    <Typography>{type}</Typography>
                    <div ref={drag} style={{cursor: 'grab'}}>
                        <DragIndicatorIcon/>
                    </div>
                </Stack>
            </React.Fragment>
        }

        return <React.Fragment>
            <Typography>{field_name}</Typography>
            <Typography>{type}</Typography>
        </React.Fragment>
    }, [field, refBody, djangoClass, djangoFields])

    return <Box sx={{display: 'flex', gap: 5, justifyContent: 'space-between'}} ref={refBody}>
        {body}
    </Box>
}
