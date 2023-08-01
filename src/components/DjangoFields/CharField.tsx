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
    const {id, type, class_name, field_name, key_id, dif_y, on_delete, tnull, blank, parent_class_name} = field
    const {djangoFields, djangoClass} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const refBody = useRef<HTMLDivElement | null>(null)

    const [{isDragging}, drag] = useDrag(
        () => ({
            type: 'item',
            item: {field_name, parent_class_name, id},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
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
            let to = null
            let from = null

            const to_field = djangoFields.find(val => val.id === key_id)
            const to_class = djangoClass.find(val => val.class_name === to_field?.parent_class_name)
            if (to_field?.dif_y && to_class && dif_y) {
                from = {x: parentClass.pos.x + 10, y: parentClass.pos.y + dif_y}
                to = {x: to_class.pos.x - 10, y: to_class.pos.y + to_field.dif_y}
                if (from.x + parentClass.width / 2 < to.x) {
                    from.x = from.x + parentClass.width
                }
                if (to.x + to_class.width / 2 < from.x) {
                    to.x = to.x + to_class.width + 20
                    from.x -= 20
                }
            }
            return <div ref={drag}
                        style={{opacity: isDragging ? 0.2 : 1}}>
                {from && to && <svg key={`con${parent_class_name + field_name}`} className="connections-container">
                    <g style={{translate: '500ms'}}>
                        <path
                            d={calculatePath(from, to)}
                            fill="transparent"
                            stroke="rgba(0, 0, 0, 0.5)"
                            strokeWidth="2"
                        ></path>
                    </g>
                </svg>}
                <Box sx={{display: 'flex', gap: 5, justifyContent: 'space-between'}}>
                    <Typography>{field_name}</Typography>
                    <Stack direction={'row'}>
                        <Typography>{type}</Typography>
                        <DragIndicatorIcon/>
                    </Stack>
                </Box>
            </div>
        }

        return <Box sx={{display: 'flex', gap: 5, justifyContent: 'space-between'}}>
            <Typography>{field_name}</Typography>
            <Typography>{type}</Typography>
        </Box>
    }, [field, refBody, djangoClass])

    return <Box ref={refBody}>
        {body}
    </Box>
}
