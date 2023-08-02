import type {ReactNode} from 'react'
import {useDrag, useDrop, XYCoord} from 'react-dnd'
import {Box, Button, Card, CardHeader, IconButton, Paper, Stack, Typography} from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import {useAppDispatch, useAppSelector} from "../hooks";
import {ClassFieldsType, DjangoClassType, Point} from "../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {FormTextField} from "./HOC";
import {addClass, addConnection, addField, updateClass} from "../store/reducers/MainReducer";
import {useNavigate, useParams} from "react-router-dom";
import ClassField from "./DjangoFields/CharField";
import {useEffect, useRef, useState} from "react";

type DjangoClassFormProps = {
    handleClose?(): void
}

export function DjangoClassForm(props: DjangoClassFormProps) {
    const {handleClose} = props
    const {control, handleSubmit, setValue} = useForm()
    const dispatch = useAppDispatch()

    function onSubmit(values: any) {
        dispatch(addClass({
            class_name: values.class_name,
            pos: {x: 10, y: 10, width: 300, height: 0},
        }))
        handleClose!()
    }

    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1} sx={{pt: 1, pm: 1}}>
            <FormTextField fieldName={'class_name'} label={'Название'} control={control} required/>
            <Button type={'submit'} variant={'contained'}>Создать</Button>
        </Stack>
    </form>
}


export interface BoxProps {
    djangoClass: DjangoClassType
}

export function DjangoClassCard(props: BoxProps) {
    const {djangoClass} = props
    const {class_name, pos, meta} = djangoClass
    const dispatch = useAppDispatch()
    const {djangoFields} = useAppSelector(state => state.mainReducer)
    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (ref.current) {
            const newClass = {...djangoClass}
            newClass.pos = {...djangoClass.pos}
            newClass.pos.height = ref.current?.clientHeight
            dispatch(updateClass({...newClass}))
        }
    }, [djangoFields])

    const [{isDragging}, drag, preview] = useDrag(
        () => ({
            type: 'card',
            item: {...djangoClass},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [djangoClass],
    )

    const [_, drop] = useDrop(
        () => ({
            accept: 'item',
            drop(item: any, monitor) {
                if (class_name !== item.parent_class_name) {
                    const newField: ClassFieldsType = {
                        parent_class_name: class_name,
                        type: 'ForeignKey',
                        field_name: `${item.field_name}_set`,
                    }
                    dispatch(addConnection(newField))
                }
                return undefined
            },
        }), [djangoFields])

    return (
        <div ref={preview}
             style={{position: 'absolute', left: pos.x, top: pos.y, opacity: isDragging ? 0 : 1}}>
            <div ref={drop}>
                <Card ref={ref} sx={{width: djangoClass.pos.width, bgcolor: 'rgba(255,0,0,1)'}}>
                    <div ref={drag}>
                        <CardHeader action={<DragIndicatorIcon/>} title={class_name} sx={{cursor: 'grab'}}/>
                    </div>
                    <Stack spacing={1} sx={{p: 1}}>
                        {djangoFields.filter(val => val.parent_class_name === class_name).map((val, i) => (
                            <ClassField key={i} parentClass={djangoClass} field={val}/>)
                        )}
                        <Button size={'small'} onClick={() => navigate(`field/${class_name}/create`)}>
                            Добавить поле
                        </Button>
                    </Stack>
                </Card>
            </div>
        </div>
    )
}