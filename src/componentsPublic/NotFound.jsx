import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';



const NotFound = () => {
    return (

        <div className="not-found-container">
            <h2 className="not-found-title">Lo siento, página no encontrada</h2>

            <h2 className="not-found-title">404</h2>
            <p className="not-found-message">Lo siento, no pudimos encontrar la página que estás buscando. ¿Quizás has escrito mal la URL? Asegúrate de verificar tu ortografía.</p>

            <NavLink to="/" style={{ textDecoration: 'none', width: '300px' }}>
                <Button
                    type='submit'
                    variant="contained"
                    fullWidth
                    style={{
                        height: '40px',
                        fontSize: '1.2rem',
                        backgroundColor: 'var(--segundo)'
                    }}

                >
                    volver a ingresar a la página
                </Button>
            </NavLink>
        </div>


    );
}

export default NotFound;

