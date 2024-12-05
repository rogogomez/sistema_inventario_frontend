import PropTypes from 'prop-types';
import Context from './Context';
import miReducer from './miReducer';
import types from './types';
import { useReducer } from 'react';


const init = () => {
    const usuario = localStorage.getItem('valor');
    try {
        return {
            logueado: !!usuario,
            usuario: usuario ? JSON.parse(usuario) : null
        };
    } catch (error) {
        // Si el contenido de 'valor' no es un JSON válido, lo eliminamos y devolvemos null
        localStorage.removeItem('valor');
        return {
            logueado: false,
            usuario: null
        };
    }
};




const Provider = ({ children }) => {
    const [autentificacion, dispatch] = useReducer(miReducer, {}, init);


    const loguearse = (usuario) => {
        const action = {
            type: types.login,
            payload: usuario,
        };
        localStorage.setItem('valor', JSON.stringify(usuario));
        dispatch(action);
    };

    const desloguearse = () => {
        const action = {
            type: types.logout,
            payload: null,
        };
        localStorage.removeItem('valor');
        dispatch(action);
    };


    return (
        <Context.Provider value={{ ...autentificacion, loguearse, desloguearse }}>
            {children}
        </Context.Provider>
    );
};

Provider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Provider;