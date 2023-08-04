import React, {cloneElement, useState} from "react";
import {TransitionProps} from "@mui/material/transitions";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton, Popover,
    Slide,
    Typography,
    useMediaQuery
} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {Control, Controller} from "react-hook-form";
import {Autocomplete, MenuItem, TextField} from "@mui/material";
import 'dayjs/locale/ru'
import {DjangoFieldType} from "../models/IDjangoModels";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})

type MainDialogProps = {
    title: string
    open_key: string
    children: React.ReactElement
    defNav?: string
}

export function MainDialog(props: MainDialogProps) {
    const {title, open_key, children, defNav} = props
    const matches = useMediaQuery((theme: any) => theme.breakpoints.down('md'))
    const navigate = useNavigate()
    let location = useLocation()

    function handleClose() {
        if (location.key === 'default') {
            navigate(defNav || '/')
        } else {
            navigate(-1)
        }
    }

    return (
        <Dialog
            fullScreen={matches}
            open={location.pathname.split('/').includes(open_key)}
            fullWidth
            maxWidth={'sm'}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <DialogTitle>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant={'h5'}>{title}</Typography>
                    <IconButton
                        onClick={handleClose}
                    >
                        <ArrowBackIosNewIcon sx={{fontSize: 30}}/>
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                {cloneElement(children, {handleClose: handleClose})}
            </DialogContent>
        </Dialog>
    )
}

type FormTextFieldProps = {
    fieldName: any
    label: string
    number?: boolean
    required?: boolean
    control: Control
    onClick?(): void
    [rest: string]: any
}

export function FormTextField(props: FormTextFieldProps) {
    const {fieldName, label, number, control, required, onClick, ...rest} = props

    const handleChange = (e: any, val: string) => {
        if (!number) return e.target.value
        const regex = /^[0-9\b]+$/
        if (e.target.value === "" || regex.test(e.target.value)) {
            return Number(e.target.value)
        }
        return val
    }

    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{required: required}}
            defaultValue={number ? 1 : ''}
            render={({field: {onChange, value}, fieldState: {invalid}}) => (
                <TextField {...rest} fullWidth value={value} onClick={onClick}
                           helperText={invalid && 'Необходимо заполнить'} error={invalid}
                           label={label} onChange={e => onClick || onChange(handleChange(e, value))}
                           sx={{minWidth: 100, flexGrow: 1, bgcolor: 'white'}} size={'small'}/>
            )}
        />
    )
}

type FormAutocompleteSelectProps = {
    fieldName: any
    label: string
    control: Control
    searchList: any[]
    required?: boolean
    multiple?: boolean
    defaultValue?: any[]
    [rest: string]: any
}

export function FormAutocompleteSelect(props: FormAutocompleteSelectProps) {
    const {fieldName, label, control, searchList, required, multiple, defaultValue, ...rest} = props

    return (
        <Controller
            name={fieldName}
            control={control}
            rules={{required: required}}
            defaultValue={multiple ? defaultValue ?? [] : searchList[0]?.id || searchList[0]}
            render={({field: {onChange, value}, fieldState: {invalid}}) => (
                <Autocomplete
                    {...rest}
                    multiple={multiple}
                    sx={{flexGrow: 1}}
                    options={searchList}
                    disableClearable
                    getOptionLabel={(option) => {
                        if (!option) return 'err'
                        return option.name || searchList.find(val => val.id === option)?.name || option || ''
                    }}
                    value={value}
                    isOptionEqualToValue={(option, val) => option.id === val || option.id === val?.id || option === val}
                    onChange={(_, val) => onChange(val?.id || val)}
                    renderInput={(params) => (
                        <TextField {...params} label={label} sx={{minWidth: 100, bgcolor: 'white'}}
                                   helperText={invalid && 'Необходимо заполнить'}
                                   error={invalid} fullWidth size={'small'}/>
                    )}
                />)}
        />
    )
}

type FormSelectProps = {
    fieldName: any
    label: string
    control: Control
    searchList: any[]
    required?: boolean
    multiple?: boolean
    [rest: string]: any
}

export function FormSelect(props: FormSelectProps) {
    const {fieldName, label, control, searchList, required, multiple, ...rest} = props
    const defaultValue = required ? searchList[0]?.id || searchList[0] : ''

    return <Controller
        name={fieldName}
        control={control}
        rules={{required: required}}
        defaultValue={multiple ? [] : defaultValue}
        render={({field: {onChange, value}, fieldState: {invalid}}) => (
            <TextField {...rest} select label={label} sx={{minWidth: 100, bgcolor: 'white'}}
                       helperText={invalid && 'Необходимо заполнить'}
                       onChange={onChange} value={value} error={invalid} fullWidth size={'small'}>
                {!required && <MenuItem value={''}>Все</MenuItem>}
                {searchList.map(val => <MenuItem key={val.id || val}
                                                 value={val.id || val}>{val.name || val}</MenuItem>)}
            </TextField>)}
    />
}

type MainPopoverProps = {
    name: string
    children: React.ReactElement
}

export function MainPopover({name, children}: MainPopoverProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Button variant="text" endIcon={<ArrowForwardIosIcon sx={{fontSize: 15, mt: '5px'}}/>}
                    sx={{p: 0, minWidth: 0, textTransform: 'none'}}
                    onClick={handleClick}>
                {name}
            </Button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
            >
                {children}
            </Popover>
        </div>
    );
}