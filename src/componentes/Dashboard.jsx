import { NavLink, Navigate, Route, Routes } from 'react-router-dom';

import { useContext, useState } from 'react';
import Context from "../contexto/Context";
import useInactivity from "../hooks/useInactivity";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';


import Header from '../componentesPrivados/Header';
import Productos from './Productos';
import Empleados from './Empleados';
import Clientes from './Clientes';
import Bodegas from './Bodegas';
import PuntosVenta from './PuntosVenta';

const Dashboard = () => {

    useInactivity(10 * 60 * 1000);

    const { usuario, logueado } = useContext(Context);

    if (!logueado) {
        return <Navigate to="/" />;
    }

    const [state, setState] = useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            {/* Aquí insertamos directamente el código HTML del menú */}
            {usuario.cargo === 'administrador' && (
                <section className="section-menu">
                    <ul>
                        <NavLink to="/dashboard/productos" className="navlink-menu">
                            <Inventory2Icon className="icon-menu" />
                            <p className="text">Productos</p>
                        </NavLink>

                        <NavLink to="/dashboard/empleados" className="navlink-menu">
                            <GroupAddIcon className="icon-menu" />
                            <p className="text">Empleados</p>
                        </NavLink>

                        <NavLink to="/dashboard/clientes" className="navlink-menu">
                            <GroupAddIcon className="icon-menu" />
                            <p className="text">Clientes</p>
                        </NavLink>

                        <NavLink to="/dashboard/puntosVenta" className="navlink-menu">
                            <BusinessCenterIcon className="icon-menu" />
                            <p className="text">Puntos de venta</p>
                        </NavLink>

                        <NavLink to="/dashboard/bodegas" className="navlink-menu">
                            <MapsHomeWorkIcon className="icon-menu" />
                            <p className="text">Puntos de almacenamiento</p>
                        </NavLink>
                    </ul>
                </section>
            )}
        </Box>
    );

    return (
        <>
            <Drawer
                anchor="left"
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {list('left')}
            </Drawer>
            <Header onMenuToggle={toggleDrawer('left', true)} userRole={usuario.cargo} />
            <div className="flex-2">
                <Routes>
                    <Route path="productos" element={< Productos userRole={usuario.cargo} />} />
                    <Route path="empleados" element={<Empleados />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="bodegas" element={<Bodegas />} />
                    <Route path="puntosVenta" element={<PuntosVenta />} />
                    <Route path="*" element={<Navigate to="productos" />} />
                </Routes>
            </div>
        </>
    );
}

export default Dashboard;
