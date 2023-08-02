import {useState} from "react";
import {useDrag, useDrop,} from 'react-dnd'
import {Button, Card, CardHeader, IconButton, Stack, TextField} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {useAppDispatch, useAppSelector} from "../hooks";
import {ClassFieldsType, DjangoClassType} from "../models/IDjangoModels";
import {useForm} from "react-hook-form";
import {FormTextField} from "./HOC";
import {addClass, addConnection, changeClassName, deleteClass, updateClass} from "../store/reducers/MainReducer";
import {useNavigate} from "react-router-dom";
import ClassField from "./CharField";
import useResizeObserver from "use-resize-observer";
import {capFirstLetter} from "../utils";

type DjangoClassFormProps = {
    handleClose?(): void
}

export function DjangoClassForm(props: DjangoClassFormProps) {
    const {handleClose} = props
    const {control, handleSubmit} = useForm()
    const {djangoClass} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()

    function onSubmit(values: any) {
        dispatch(addClass({
            class_name: capFirstLetter(values.class_name),
            pos: {x: 10 * (djangoClass.length % 10), y: 10, width: 300, height: 0},
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
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
    const {class_name, pos, color} = djangoClass
    const dispatch = useAppDispatch()
    const {djangoFields} = useAppSelector(state => state.mainReducer)
    const navigate = useNavigate()
    const [headEdit, setHeadEdit] = useState(false)

    const {ref} = useResizeObserver<HTMLDivElement>({
        onResize: ({width, height}) => {
            const newClass = {...djangoClass}
            newClass.pos = {...djangoClass.pos}
            if (height && width && (newClass.pos.height !== height || newClass.pos.width !== width)) {
                newClass.pos.height = height
                newClass.pos.width = width + 20
                dispatch(updateClass({...newClass}))
            }
        },
    })

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
                        id: djangoFields.length + 1,
                        parent_class_name: class_name,
                        type: 'ForeignKey',
                        field_name: `${item.field_name}_set`,
                        field_id: item.id,
                    }
                    dispatch(addConnection({field: item, key:newField}))
                }
                return undefined
            },
        }), [djangoFields])

    return (
        <div ref={preview}
             style={{
                 position: 'absolute',
                 left: pos.x,
                 top: pos.y,
                 padding: '10px',
                 opacity: isDragging ? 0 : 1,
             }}>
            <div ref={drop}>
                <Card ref={ref} sx={{resize: 'horizontal'}}>
                    <div ref={drag} draggable={!headEdit}>
                        <CardHeader
                            titleTypographyProps={{variant: 'h6'}}
                            onDoubleClick={() => setHeadEdit(true)}
                            action={<IconButton size={'small'}
                                                onClick={() => dispatch(deleteClass(class_name))}>
                                <DeleteIcon/>
                            </IconButton>}
                            title={headEdit ?
                                <TextField fullWidth size={'small'} defaultValue={class_name} onKeyDown={(e: any) => {
                                    if (e.code === "Enter") {
                                        setHeadEdit(false)
                                        if (e.target?.value) {
                                            dispatch(changeClassName({
                                                new_class_name: capFirstLetter(e.target.value),
                                                class_name
                                            }))
                                        }
                                    } else if (e.code === "Escape") {
                                        setHeadEdit(false)
                                    }
                                }}/> : class_name}
                            sx={{p: 1, cursor: 'grab', bgcolor: color}}/>
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