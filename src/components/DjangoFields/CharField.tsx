import {Box} from '@mui/material';
import React, {useEffect, useRef, useState} from 'react';
import {useDrag, XYCoord} from "react-dnd";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {ClassFieldsType} from "../../models/IDjangoModels";


export function CharFieldForm() {
    return (
        <div/>
    )
}


type CharFieldProps = {
    field: ClassFieldsType
}

export default function CharField(props: CharFieldProps) {
    const {field} = props
    const {max_length, field_name, tnull, blank} = field
    const ref = useRef<HTMLDivElement | null>(null)

    // console.log(ref.current?.getBoundingClientRect())

    return <Box ref={ref} sx={{width: 30, height: 50, bgcolor: 'red'}}>

    </Box>
}
