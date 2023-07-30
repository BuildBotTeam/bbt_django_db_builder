import type {ReactNode} from 'react'
import {useDrag} from 'react-dnd'
import {Button, Paper, Stack, Typography} from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {useAppDispatch} from "../hooks";
import {DjangoClassType, Point} from "../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {FormTextField} from "./HOC";
import {addClass} from "../store/reducers/MainReducer";

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
            pos: {x: 10, y: 10},
            fields: []
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
    const {class_name, pos, meta, fields} = djangoClass
    const dispatch = useAppDispatch()

    const [{isDragging}, drag, preview] = useDrag(
        () => ({
            type: 'card',
            item: {class_name, pos},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [class_name, pos],
    )

    if (isDragging) {
        return <div ref={drag} style={{cursor: 'grabbing !important'}}/>
    }
    return (
        <div ref={preview} style={{position: 'absolute', left: pos.x, top: pos.y}}>
            <Paper>
                <div ref={drag} style={{textAlign: 'right'}}>
                    <DragHandleIcon sx={{cursor: 'grab'}}/>
                </div>
                <Typography>ClassName</Typography>
            </Paper>
        </div>
    )
}