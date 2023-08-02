import type {CSSProperties} from 'react'
import React, {useMemo} from 'react'
import type {XYCoord} from 'react-dnd'
import {useDrop} from 'react-dnd'
import {DjangoClassCard, DjangoClassForm} from "./DjangoClassCard";
import {Box, Button, ButtonGroup} from "@mui/material";
import {calculatePath} from "../utils";
import {useAppDispatch, useAppSelector} from "../hooks";
import {DjangoClassType} from "../models/IDjangoModels";
import {updateClass} from "../store/reducers/MainReducer";
import {useNavigate} from "react-router-dom";
import {MainDialog} from "./HOC";
import {ClassFieldsForm} from "./CharField";

const styles: CSSProperties = {
    width: '100vw',
    height: '100vh',
    border: '1px solid black',
    position: 'relative',
}

export default function WorkDesk() {
    const {djangoClass, djangoFields} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [_, drop] = useDrop(
        () => ({
            accept: 'card',
            // hover(item: DjangoClassType, monitor) {
            //     const newItem = {...item}
            //     const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
            //     const x = Math.round(item.pos.x + delta.x)
            //     const y = Math.round(item.pos.y + delta.y)
            //     newItem.pos = {...item.pos, x, y}
            //     dispatch(updateClass(newItem))
            //     return undefined
            // },
            drop(item: DjangoClassType, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                const x = Math.round(item.pos.x + delta.x)
                const y = Math.round(item.pos.y + delta.y)
                item.pos = {...item.pos, x, y}
                dispatch(updateClass(item))
                return undefined
            }
        }), [djangoClass]
    )

    const body = useMemo(() => djangoClass.map((val, i) => <DjangoClassCard key={i} djangoClass={val}/>), [djangoClass])


    const connections = useMemo(() => {
        // console.clear()
        // console.log(djangoFields)
        return djangoFields.filter(val => val.type === 'ForeignField').map(field => {
            const from_class = djangoClass.find(val => val.class_name === field.parent_class_name)
            if (from_class?.pos && field.dif_y) {
                const from = {...from_class.pos, y: from_class.pos.y + field.dif_y}
                const key = djangoFields.find(val => val.id === field.key_id)
                const to_class = djangoClass.find(val => val.class_name === key?.parent_class_name)
                if (to_class?.pos && key?.dif_y) {
                    const to = {...to_class.pos, y: to_class.pos.y + key.dif_y}
                    const path = calculatePath(from, to)
                    return (<svg key={field.id} className="connections-container">
                        <path
                            d={path}
                            fill="transparent"
                            stroke="rgba(0, 0, 0, 0.5)"
                            strokeWidth="2"
                        ></path>
                    </svg>)
                }
            }
            return null
        })
    }, [djangoClass, djangoFields])

    return (<React.Fragment>
            {connections}
            <Box ref={drop} sx={styles}>
                {body}
            </Box>
            <ButtonGroup sx={{position: 'fixed', bottom: 10, left: '50%', transform: 'translateX(-50%)'}}>
                <Button onClick={() => {
                    navigate('class/create')
                }}>Создать</Button>
            </ButtonGroup>
            <MainDialog title='Класс' open_key={'class'}><DjangoClassForm/></MainDialog>
            <MainDialog title='Поле' open_key={'field'}><ClassFieldsForm/></MainDialog>
        </React.Fragment>
    )
}