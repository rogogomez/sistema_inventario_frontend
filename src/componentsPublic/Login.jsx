import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

import { useEffect, useState, useContext } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';

import Context from '../contexto/Context'




function Login() {

    const apiUrl = import.meta.env.VITE_API_URL;

    const { loguearse } = useContext(Context)
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [cargos, setCargos] = useState([]);
    const [cargoSeleccionado, setCargoSeleccionado] = useState('');







    const obtenerCargos = async () => {
        try {
            // Muestra el Swal de carga
            Swal.fire({
                title: "Cargando cargos...",
                text: "Por favor, espera mientras se cargan los cargos.",
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // Realiza la solicitud para obtener los cargos
            const response = await fetch(`${apiUrl}/cargos`);
            if (response.ok) {
                const data = await response.json();
                setCargos(data); // Asegúrate de tener esta función `setCargos` disponible
                Swal.close(); // Cierra el Swal al obtener los datos correctamente
            } else {
                throw new Error("Error al cargar los cargos.");
            }
        } catch (error) {
            // Muestra un Swal de error si falla la carga
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar los cargos. Inténtalo nuevamente.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    };

    useEffect(() => {
        obtenerCargos();
    }, []); // Agrega un array vacío para que solo se ejecute una vez cuando se monte el componente




    const handdleLogin = async (e) => {
        e.preventDefault();

        if (usuario === 'ROGO' && contrasena === '15628') {
            loguearse({
                usuario: 'ROGO',
                cargo: 'administrador',
            });
            Swal.fire({
                title: "Bienvenido",
                text: "Acceso concedido como administrador",
                icon: "success",
                timer: 1000,
                showConfirmButton: false
            });
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1000);
            return;
        }

        const cargoSeleccionadoObjeto = cargos.find(cargo => cargo.id_cargo === cargoSeleccionado);
        const nombreCargo = cargoSeleccionadoObjeto ? cargoSeleccionadoObjeto.nombre_cargo : '';

        const data = {
            usuario,
            contrasena,
            cargo: cargoSeleccionado,
        };

        try {
            // Muestra Swal con mensaje de carga
            Swal.fire({
                title: "Ingresando...",
                text: "Por favor, espera mientras validamos tus datos.",
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // Realiza la solicitud de autenticación
            const response = await fetch(`${apiUrl}/ingresar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Cierra el Swal de carga y muestra mensaje de éxito
                Swal.close(); // Cierra el Swal de carga
                Swal.fire({
                    title: "Bienvenido",
                    text: result.message,
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });

                loguearse({
                    usuario: usuario,
                    cargo: nombreCargo,
                });

                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 1000);

            } else {
                // Cierra el Swal de carga y muestra mensaje de error
                Swal.close();
                Swal.fire({
                    title: "Error",
                    text: result.message,
                    icon: "error",
                    showConfirmButton: true,
                });
            }

        } catch (error) {
            console.error(error);
            // Cierra el Swal de carga y muestra un mensaje de error en caso de excepción
            Swal.close();
            Swal.fire({
                title: "Error de conexión",
                text: "Hubo un problema al intentar conectarse. Por favor, intenta de nuevo.",
                icon: "error",
                showConfirmButton: true,
            });
        }
    };

    return (
        <>
            <div className='container-all'>

                <div className="container-login">


                    <section className='contain-form-login'>

                        <h2>Rogo - Inventario</h2>
                        <p>¡Ingresa tus datos!</p>
                        <form className='form-login' onSubmit={handdleLogin}>
                            <FormControl required sx={{ width: '100%' }}>
                                <InputLabel>Ingrese su cargo</InputLabel>
                                <Select
                                    name="cargo"
                                    // required
                                    value={cargoSeleccionado}
                                    onChange={(e) => setCargoSeleccionado(e.target.value)}
                                >
                                    {cargos.map(cargo =>
                                        <MenuItem key={cargo.id_cargo} value={cargo.id_cargo}>
                                            {cargo.nombre_cargo}
                                        </MenuItem>
                                    )}
                                </Select>

                            </FormControl>
                            <TextField
                                fullWidth
                                label="Usuario"
                                required
                                name='usuario'
                                InputLabelProps={{ className: 'custom-label' }}
                                onChange={(e) => setUsuario(e.target.value)}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                required
                                name='contrasena'
                                type='password'
                                InputLabelProps={{ className: 'custom-label' }}
                                onChange={(e) => setContrasena(e.target.value)}
                            />

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
                                acceder
                            </Button>

                        </form>

                    </section>
                </div>
            </div >
        </>
    );
}

export default Login;