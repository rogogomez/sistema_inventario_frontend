

import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';

const Empleados = () => {

  const apiUrl = import.meta.env.VITE_API_URL;


  // Agrega un nuevo estado para almacenar el ID del empleado seleccionado para editar
  const [empleadoID, setEmpleadoID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formularioAdd, setFormularioAdd] = useState(false);
  const [detalleEmpleado, setDetalleEmpleado] = useState(null);
  const [formularioInformacion, setFormularioInformacion] = useState({
    cedula: '',
    nombres: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    id_cargo: '',
    salario: '',
    fecha_ingreso: '',
    fecha_nacimiento: '',
    nombre_usuario: '',
    contrasena: '',
  });

  const [cedulaError, setCedulaError] = useState(false);
  const [salarioError, setSalarioError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [nombresError, setNombresError] = useState(false);
  const [correoError, setCorreoError] = useState(false);


  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    // Obtener los componentes de la fecha (año, mes, día)
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    // Construir la cadena con el formato deseado (YYYY-MM-DD)
    return `${año}-${mes}-${dia}`;
  };

  const fecha = new Date(); // Obtener la fecha actual, por ejemplo
  const año = fecha.getFullYear(); // Obtener el año (ej: 2024)
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes (con ceros a la izquierda si es necesario)
  const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día (con ceros a la izquierda si es necesario)

  const fechaFormateada = `${año}-${mes}-${dia}`; // Construir la cadena con el formato deseado

  // console.log(fechaFormateada); // Imprimir la fecha formateada (ej: '2024-05-31')

  // Función para activar el modo de edición y cargar los datos del empleado seleccionado
  const activarModoEdicion = (empleado) => {
    setModoEditar(true);
    setFormularioAdd(true);
    setFormularioInformacion(empleado);
    setEmpleadoID(empleado.id_empleado); // Guarda el ID del empleado que se está editando
  };




  // Función para manejar cambios en los inputs del formulario
  const cambiosInputs = (e) => {
    const { name, value } = e.target;

    setFormularioInformacion({ ...formularioInformacion, [name]: value });

    switch (name) {
      case 'cedula':
        if (/^\d+$/.test(value) || value === '') {
          setCedulaError(false); // No hay error si el valor es válido o está vacío
        } else {
          setCedulaError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'salario':
        if (/^\d+$/.test(value) || value === '') {
          salarioError(false); // No hay error si el valor es válido o está vacío
        } else {
          setSalarioError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'telefono':
        if (/^\d+$/.test(value) || value === '') {
          setTelefonoError(false); // No hay error si el valor es válido o está vacío
        } else {
          setTelefonoError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'nombres':
        if (/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/.test(value) || value === '') {
          setNombresError(false); // No hay error si el valor es válido o está vacío
        } else {
          setNombresError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'correo_electronico':
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === '') {
          setCorreoError(false); // No hay error si el valor es un correo válido o está vacío
        } else {
          setCorreoError(true); // Hay error si el valor no cumple con el formato de correo
        }
        break;


      default:
        break;
    }


  };

  const obtenerEmpleados = async () => {
    try {
      // Mostrar mensaje de carga
      Swal.fire({
        title: "Cargando empleados...",
        text: "Por favor, espera mientras se cargan los empleados.",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`${apiUrl}/empleados`);
      if (response.ok) {
        const data = await response.json();

        // Formatear las fechas de los empleados
        const empleadosFormateados = data.map(empleado => ({
          ...empleado,
          fecha_ingreso: formatearFecha(empleado.fecha_ingreso),
          fecha_nacimiento: formatearFecha(empleado.fecha_nacimiento),
        }));

        // Asignar los empleados al estado
        setEmpleados(empleadosFormateados);

        // Cerrar el mensaje de carga
        Swal.close();
      } else {
        // Cerrar el mensaje de carga y mostrar error
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener los empleados. Inténtalo de nuevo.",
        });
      }
    } catch (error) {
      // Cerrar el mensaje de carga en caso de error
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar obtener los empleados.",
      });
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);


  const obtenerEmpleadoPorId = async (idEmpleado) => {
    try {
      const response = await fetch(`${apiUrl}/empleados/${idEmpleado}`);
      const data = await response.json();

      const empleadoFormateado = {
        ...data,
        fecha_ingreso: formatearFecha(data.fecha_ingreso),
        fecha_nacimiento: formatearFecha(data.fecha_nacimiento),
      };
      setDetalleEmpleado(empleadoFormateado);
    } catch (error) {
      console.error("Error al obtener el empleado:", error);
    }
  };



  const agregarEmpleado = async (e) => {
    e.preventDefault();

    // Validaciones de campos requeridos
    for (const key in formularioInformacion) {
      if (formularioInformacion[key] === "") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `El campo ${key} es obligatorio.`,
        });
        return;
      }
    }



    try {
      let url = `${apiUrl}/empleados`;
      let method = 'POST';
      if (modoEditar) {
        url += `/${empleadoID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formularioInformacion),
        fecha_ingreso: fechaFormateada,
        fecha_nacimiento: fechaFormateada,
      });

      if (response.status === 400) {
        const data = await response.json();
        if (data.error && data.error === "REGISTRO_DUPLICADO") {
          // Mostrar el mensaje de error al usuario utilizando SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        } else {
          console.error('Error al agregar o actualizar el empleado');
          return;
        }
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el empleado');
        return;
      }

      // const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Empleado Actualizado',
          text: 'El empleado ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Empleado Agregado',
          text: 'El empleado ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      cerrarFormulario();
      obtenerEmpleados(); // Actualiza la lista de empleados después de agregar o editar uno
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };


  // Función para eliminar un empleado
  const eliminarEmpleado = async (empleadoId, empleadoNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar Empleado",
        html: `¿Seguro que quieres eliminar a  <strong>${empleadoNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/empleados/${empleadoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message); // Lanza un error con el mensaje del backend
        }

        setEmpleados(
          empleados.filter((empleado) => empleado.id_empleado !== empleadoId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El empleado  <strong>${empleadoNombre}</strong>? ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerEmpleados(); // Asumiendo que fetchEmpleados() es una función que actualiza la lista de empleados
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message, // Muestra el mensaje de error del backend
      });
    }
  };


  const mostarFormulario = () => {
    setFormularioAdd(true);
  };

  // Función para cerrar el formulario y limpiar los datos
  const cerrarFormulario = () => {
    setModoEditar(false);
    setFormularioAdd(false);
    setDetalleEmpleado(false);
    setFormularioInformacion({
      cedula: '',
      nombres: '',
      correo_electronico: '',
      telefono: '',
      direccion: '',
      id_cargo: '',
      salario: '',
      fecha_ingreso: '',
      fecha_nacimiento: '',
      nombre_usuario: '',
      contrasena: '',
    });
    setEmpleadoID(null); // Reinicia el ID del empleado seleccionado
  };
  const style_form = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    height: 'auto', // Establece una altura específica para permitir el desplazamiento
    bgcolor: 'background.paper',

    borderRadius: '10px',

    pt: 2,
    px: 4,
    pb: 3,
    overflowY: 'auto', // Desplazamiento solo vertical
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      pt: 0,
      px: 0,
      pb: 0,
      height: '100vh',
    },
  };

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '400px',
    height: '100vh',
    bgcolor: 'background.paper',
    overflow: 'auto',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative', // Corrige 'relativa' a 'relative'
      top: 'auto',
      left: 'auto',
      transform: 'none',
    },
  };



  const [subMenu, setSubMenu] = useState(false)
  const ocultarSubMenu = () => {
    setSubMenu(false)
  };
  const capitalizeWords = (str) => {
    return str.split(' ').map(word => capitalize(word)).join(' ');
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };



  return (
    <section className="section-item">
      <div className=" contenedor_buscar">
        <div className="witches">
          <ul className="witches-list ">
            <li className="witches-item">
              <span className="cantidad-empleados">{empleados.length}</span>
              Lista de empleados
            </li>

          </ul>
        </div>
        <IconButton
          onClick={mostarFormulario}
          style={{ background: 'var(--tercero)' }}>
          <AddIcon style={{ color: 'var(--primer)' }} />
        </IconButton>
      </div>

      <table className="tabla-items">
        <tbody>
          {empleados.map((empleado, index) => (
            <tr className="fila" key={index}>
              {/* <td className="one"><strong>{index + 1}</strong></td> */}
              <td className="a2">
                <div className="centered-content">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {capitalizeWords(empleado.nombres)}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {empleado.cedula}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <LocalPostOfficeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {empleado.correo_electronico}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <ContactsOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  <div className="contacto">
                    <span>{empleado.telefono}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#636363' }}> {empleado.direccion}</span>
                  </div>
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">
                  <PeopleOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {empleado.nombre_cargo}
                </div>

              </td>
              <td className="a1">
                <div className="centered-content">
                  <AttachMoneyOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {empleado.salario}
                </div>

              </td>
              <td className="a10">

                <IconButton onClick={() => setSubMenu(empleado.id_empleado)}>
                  <MoreVertIcon />
                </IconButton>
                {subMenu === empleado.id_empleado && (
                  <div className="sub_menu" onMouseLeave={ocultarSubMenu}>
                    <div onClick={() => obtenerEmpleadoPorId(empleado.id_empleado)}>
                      <IconButton size="small" color="success">
                        <InfoIcon />
                      </IconButton>
                      <span>Detalles</span>
                    </div>

                    <div onClick={() => activarModoEdicion(empleado)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <span>Editar</span>
                    </div>

                    <div onClick={() => eliminarEmpleado(empleado.id_empleado, empleado.nombres)}>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                      <span>Eliminar</span>
                    </div>
                  </div>
                )}

              </td>


            </tr>
          ))}
        </tbody>
      </table>

      {/* codigo de formalario add */}
      <Modal
        open={formularioAdd}
        onClose={cerrarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_form }}>
          <form className="grid-form" onSubmit={agregarEmpleado}>
            <h2 className="title-form">{modoEditar ? 'Editar Empleado' : 'Agregar Empleado'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                disabled={modoEditar}
                fullWidth
                label="Cedula"
                name="cedula"
                value={formularioInformacion.cedula}
                onChange={cambiosInputs}
                error={cedulaError}
                helperText={cedulaError ? 'Solo números permitidos' : ''}
                required
              />
              <TextField
                disabled={modoEditar}
                fullWidth
                label="Nombres"
                name="nombres"
                value={formularioInformacion.nombres}
                onChange={cambiosInputs}
                error={nombresError}
                helperText={nombresError ? 'Solo se permiten letras de la (A) a la (Z)' : ''}
                required
              />
              <TextField
                fullWidth
                label="Correo electrónico"
                type="email"
                name="correo_electronico"
                value={formularioInformacion.correo_electronico}
                onChange={cambiosInputs}
                error={correoError}
                helperText={correoError ? 'El correo es invalido!' : ''}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formularioInformacion.telefono}
                onChange={cambiosInputs}
                error={telefonoError}
                helperText={telefonoError ? 'Solo números permitidos' : ''}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                value={formularioInformacion.direccion}
                onChange={cambiosInputs}
                required
              />



              <select
                name="id_cargo"
                value={formularioInformacion.id_cargo}
                onChange={cambiosInputs}
                required
              >
                <option value="" disabled>Elige un cargo</option>
                <option value="1">Administrador</option>
                <option value="2">Bodeguero</option>
                <option value="3">Vendedor</option>
              </select>



              <TextField
                fullWidth
                label="Salario"
                name="salario"
                value={formularioInformacion.salario}
                onChange={cambiosInputs}
                required
                error={salarioError}
                helperText={salarioError ? 'Solo números permitidos' : ''}
              />
              <TextField
                fullWidth
                label="Fecha de ingreso"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}

                name="fecha_ingreso"
                value={formularioInformacion.fecha_ingreso}
                onChange={cambiosInputs}
                required
                disabled={modoEditar ? true : false}
              />
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}

                name="fecha_nacimiento"
                value={formularioInformacion.fecha_nacimiento}
                onChange={cambiosInputs}
                required
                disabled={modoEditar ? true : false}
              />
            </div>

            <h2 className="title-form">Usuario</h2>
            <div className="contain-usuario">
              <TextField
                fullWidth
                label="Usuario"
                disabled={modoEditar ? true : false}
                name="nombre_usuario"
                value={formularioInformacion.nombre_usuario}
                onChange={cambiosInputs}
                required
              />
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                disabled={modoEditar ? true : false}
                name="contrasena"
                value={formularioInformacion.contrasena}
                onChange={cambiosInputs}
                required
              />
            </div>
            {/* <Divider /> */}
            <div className="contain-btns">
              <Button variant="outlined" color="error" onClick={cerrarFormulario}>Cancelar</Button>
              <Button
                variant="contained"
                color="success"
                type="submit"

              >
                {modoEditar ? 'Guardar cambios' : 'Agregar empleado'}
              </Button>
            </div>
          </form>

        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleEmpleado)}
        onClose={cerrarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"

      >
        <Box sx={{ ...style }}>

          {detalleEmpleado && (

            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles del empleado</h2>
                <IconButton onClick={cerrarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Identificación</strong>
                    <span className="detalle_valor">{detalleEmpleado.cedula}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Nombres y apellidos</strong>
                    <span className="detalle_valor">{capitalizeWords(detalleEmpleado.nombres)}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <LocalPostOfficeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Correo Electrónico</strong>
                    <span className="detalle_valor">{detalleEmpleado.correo_electronico}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PhoneIphoneOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Teléfono</strong>
                    <span className="detalle_valor">{detalleEmpleado.telefono}</span>
                  </div>
                </div>

                <div className="detalle_item google">
                  <PlaceIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Dirección</strong>
                    <span className="detalle_valor">{capitalizeWords(detalleEmpleado.direccion)}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PeopleOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Cargo</strong>
                    <span className="detalle_valor">{capitalizeWords(detalleEmpleado.nombre_cargo)}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <AttachMoneyOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Salario</strong>
                    <span className="detalle_valor">{detalleEmpleado.salario}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <CalendarMonthOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Fecha de Ingreso</strong>
                    <span className="detalle_valor">{detalleEmpleado.fecha_ingreso}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <CalendarMonthOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Fecha de Nacimiento</strong>
                    <span className="detalle_valor">{detalleEmpleado.fecha_nacimiento}</span>
                  </div>
                </div>

              </div>


            </div>

          )}



        </Box>
      </Modal>


    </section >

  )
}

export default Empleados;