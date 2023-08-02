import React from 'react';
import {DndProvider} from 'react-dnd';
import {Outlet} from 'react-router-dom';
import {HTML5Backend} from "react-dnd-html5-backend";

export default function HomePage() {
    return <DndProvider backend={HTML5Backend}>
        <Outlet/>
    </DndProvider>
}
