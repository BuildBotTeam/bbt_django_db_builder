import {Box, Button, Stack, Typography} from '@mui/material';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useDrag, XYCoord} from "react-dnd";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {ClassFieldsType, ClassFieldTypeList, Point} from "../../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {addField} from "../../store/reducers/MainReducer";
import {useAppDispatch} from "../../hooks";
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
    parent_class_name: string
}

export default function ClassField(props: ClassFieldProps) {
    const {field: {type, class_name, field_name, key_id, on_delete, tnull, blank}, parent_class_name} = props
    const ref = useRef<HTMLDivElement | null>(null)

    const [{isDragging}, drag] = useDrag(
        () => ({
            type: 'item',
            item: {field_name, parent_class_name},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [parent_class_name, field_name],
    )

    const body = () => {
        if (type === 'ForeignField') {
            const rect = ref?.current?.getBoundingClientRect() as Point
            const to = document.getElementById(key_id || `${parent_class_name + field_name}_set`)?.getBoundingClientRect() as Point
            console.log(to, `${parent_class_name + field_name}_set`)
            return <div ref={drag}
                        style={{opacity: isDragging ? 0.2 : 1}}>
                {to && <svg key={`con${parent_class_name + field_name}`} className="connections-container">
                    <g style={{translate: '500ms'}}>
                        <path
                            d={calculatePath(rect, to)}
                            fill="transparent"
                            stroke="rgba(0, 0, 0, 0.5)"
                            strokeWidth="2"
                        ></path>
                    </g>
                </svg>}
                <Box ref={ref} sx={{display: 'flex', gap: 5, justifyContent: 'space-between'}}>
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
    }

    return <Box id={key_id}>
        {body()}
    </Box>
}
