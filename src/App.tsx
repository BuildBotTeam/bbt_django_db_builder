import React, {useEffect, ReactElement, useMemo} from 'react';
import './App.scss';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {checkToken, logout} from "./store/actions/auth";
import {useAppDispatch, useAppSelector} from "./hooks";
import {
    Box, CircularProgress,
    createTheme,
    CssBaseline,
    ThemeProvider
} from '@mui/material';
import {useSnackbar} from "notistack";
import WorkDesk from "./components/WorkDesk";
import HomePage from "./components/HomePage";

const theme = createTheme({
    typography: {
        fontFamily: 'Arial',
    },
    palette: {
        // mode: 'dark',
        background: {
            // default: '#d7edf1',
            paper: '#f5f8f8'
        },
        primary: {
            main: '#2c6e6a',
        },
        secondary: {
            main: '#2da3c2'
        },
    },
    components: {
        MuiListItem: {
            styleOverrides: {
                root: {
                    transition: '500ms',
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(44,109,106, 0.7)',

                        'svg, span': {
                            color: '#f5f8f8'
                        }
                    }
                }
            }
        }
    }
});

export type NavItemType = {
    name: string
    icon: ReactElement
    start_path: string
    path: string
    validate?: string
    component: ReactElement
    children?: NavItemType[]
}

export var defaultNavList: NavItemType[] = [
    {
        name: '',
        icon: <div/>,
        start_path: '',
        path: '',
        validate: '',
        component: <WorkDesk/>,
        children: [
            {
                name: 'class',
                icon: <div/>,
                start_path: 'class',
                path: '/create?/:class_name?/edit?',
                validate: '',
                component: <WorkDesk/>,
            },
            {
                name: 'field',
                icon: <div/>,
                start_path: 'field',
                path: '/:class_name/create?/:field_name?/edit?',
                validate: '',
                component: <WorkDesk/>
            },
        ]
    },
]

const App: React.FC = () => {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    function recursiveBuildNav(navItem: NavItemType) {
        if (navItem.children && navItem.children.length > 0) {
            const childs = navItem.children?.map(nav => recursiveBuildNav(nav))
            return <Route key={navItem.name} path={navItem.start_path + navItem.path} element={navItem.component}>
                {childs}
            </Route>
        }
        return <Route key={navItem.name} path={navItem.start_path + navItem.path} element={navItem.component}/>
    }

    const navigationList = useMemo(() => {
        let nav = '/'
        const newList = defaultNavList.map((navItem, index) => {
            if (index === 0 && navItem.path !== '/') nav = navItem.start_path
            return recursiveBuildNav(navItem)

        })
        if (nav !== '/') newList.push(<Route key={'redirect'} path="/" element={<Navigate to={nav}/>}/>)
        return newList
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <CssBaseline/>
                <Routes>
                    <Route path="/" element={<HomePage/>}>
                        {navigationList}
                    </Route>
                </Routes>
            </div>
        </ThemeProvider>
    )
}

export default App;
