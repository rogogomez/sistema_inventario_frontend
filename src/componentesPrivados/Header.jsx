import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from "@mui/material";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../contexto/Context';

const Header = ({ onMenuToggle, userRole }) => {
    const navigate = useNavigate();
    const { desloguearse, usuario } = useContext(Context);

    const CerrarSesion = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Realmente quieres cerrar sesión?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                desloguearse();
                navigate("/", { replace: true });
            }
        });
    };

    return (
        <div className='encabezado-header'>
            <header className="header">
                <div className="iconos-izquierda">
                    {(userRole === 'administrador') && (
                        <IconButton onClick={onMenuToggle}>
                            <MenuIcon sx={{ color: 'var(--tercero)', fontSize: '2rem' }} />
                        </IconButton>
                    )}
                    <h2>
                        <span style={{ textTransform: 'uppercase' }}>
                            {usuario.cargo} : {usuario.usuario}
                        </span>
                    </h2>
                </div>

                <IconButton onClick={CerrarSesion}>
                    <LogoutIcon />
                </IconButton>

            </header>
        </div>
    );
};

// Agregar validación de prop-types
Header.propTypes = {
    onMenuToggle: PropTypes.func.isRequired,
    userRole: PropTypes.string.isRequired,
};

export default Header;
