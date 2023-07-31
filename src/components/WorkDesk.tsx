import update from 'immutability-helper'
import type {CSSProperties} from 'react'
import React, {useCallback, useEffect, useState} from 'react'
import type {XYCoord} from 'react-dnd'
import {useDrop} from 'react-dnd'
import {DjangoClassCard, DjangoClassForm} from "./DjangoClassCard";
import {Box, Button, ButtonGroup, Fab} from "@mui/material";
import {calculatePath} from "../utils";
import {useAppDispatch, useAppSelector} from "../hooks";
import {DjangoClassType, Point} from "../models/IDjangoModels";
import {addClass, updateClass} from "../store/reducers/MainReducer";
import {useNavigate} from "react-router-dom";
import {MainDialog} from "./HOC";
import {ClassFieldsForm} from "./DjangoFields/CharField";

const styles: CSSProperties = {
    width: '100%',
    height: '100vh',
    border: '1px solid black',
    position: 'relative',
}

export default function WorkDesk() {
    const {djangoClass, connections} = useAppSelector(state => state.mainReducer)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [_, drop] = useDrop(
        () => ({
            accept: 'card',
            drop(item: DjangoClassType, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
                const x = Math.round(item.pos.x + delta.x)
                const y = Math.round(item.pos.y + delta.y)
                item.pos = {x, y}
                dispatch(updateClass(item))
                return undefined
            },
        }),[djangoClass]
    )

    // function findConnection({class_name, field_name}: { class_name: string, field_name: string }) {
    //     return djangoClass.find(v => v.class_name === class_name)?.fields
    //         .find(v => v.field_name === field_name)?.ref
    // }

    return (<React.Fragment>
            {/*{connections.map((val, index) => {*/}
            {/*    const from = document.getElementById(val.from)?.getBoundingClientRect() as Point*/}
            {/*    const to = document.getElementById(val.to)?.getBoundingClientRect() as Point*/}
            {/*    console.log(from, to)*/}
            {/*    if (!from || !to) return null*/}
            {/*    return <svg key={`con${index}`} className="connections-container">*/}
            {/*        <g style={{translate: '500ms'}}>*/}
            {/*            <path*/}
            {/*                d={calculatePath(from, to)}*/}
            {/*                fill="transparent"*/}
            {/*                stroke="rgba(0, 0, 0, 0.5)"*/}
            {/*                strokeWidth="2"*/}
            {/*            ></path>*/}
            {/*        </g>*/}
            {/*    </svg>*/}
            {/*})}*/}
            <Box ref={drop} sx={styles}>
                {djangoClass.map((val, i) => <DjangoClassCard key={i} djangoClass={val}/>)}
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