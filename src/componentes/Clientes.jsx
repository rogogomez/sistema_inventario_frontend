import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";



import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
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

import Context from "../contexto/Context";




const Clientes = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { usuario } = useContext(Context);
  const [clienteID, setClienteID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleCliente, setDetalleCliente] = useState(null)
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    correo_electronico: '',
    telefono: '',
    direccion: ''
  });
  const [cedulaError, setCedulaError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [nombresError, setNombresError] = useState(false);
  const [correoError, setCorreoError] = useState(false);


  const activarModoEdicion = (cliente) => {
    setModoEditar(true);
    setFormulario(true);
    setFormData(cliente); // Actualiza el estado del formulario con los datos del cliente
    setClienteID(cliente.id_cliente); // Guarda el ID del cliente que se está editando
  };




  // Función para manejar cambios en los inputs del formulario
  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    switch (name) {
      case 'cedula':
        if (/^\d+$/.test(value) || value === '') {
          setCedulaError(false); // No hay error si el valor es válido o está vacío
        } else {
          setCedulaError(true); // Hay error si el valor contiene caracteres no permitidos
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

  const obtenerClientes = async () => {
    try {
      const response = await fetch(`${apiUrl}/clientes`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data);
      } else {
        console.error("No se pudo obtener los clientes");
      }
    } catch (error) {
      console.error('error al obtener los clientes', error);
    }
  }
  useEffect(() => {
    obtenerClientes();
  });






  const enviarForm = async (e) => {
    e.preventDefault();
    if (
      cedulaError ||
      telefonoError ||
      nombresError ||
      correoError ||
      !formData.cedula ||
      !formData.nombres ||
      !formData.correo_electronico ||
      !formData.telefono ||
      !formData.direccion
    ) {
      return; // No envía el formulario si hay errores o campos vacíos
    }

    try {
      let url = `${apiUrl}/clientes`;
      let method = 'POST';
      if (modoEditar) {
        url += `/${clienteID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
          console.error('Error al agregar o actualizar el cliente');
          return;
        }
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el cliente');
        return;
      }

      // const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Cliente Actualizado',
          text: 'El cliente ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Cliente Agregado',
          text: 'El cliente ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerClientes(); // Actualiza la lista de clientes después de agregar o editar uno
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  const obtenerClientePorId = async (idCliente) => {
    try {
      const response = await fetch(`${apiUrl}/clientes/${idCliente}`);
      if (response.ok) {
        const data = await response.json();
        setDetalleCliente(data);
      } else {
        console.error("No se pudo obtener los clientes");
      }
    } catch (error) {
      console.error('error al obtener los clientes', error);
    }
  }

  // Función para eliminar un empleado
  const eliminarCliente = async (clienteId, clienteNombre) => {
    if (usuario.cargo !== 'administrador') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para eliminar clientes.',
      });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Eliminar cliente",
        html: `¿Seguro que quieres eliminar a  <strong>${clienteNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/clientes/${clienteId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message); // Lanza un error con el mensaje del backend
        }

        setClientes(
          clientes.filter((cliente) => cliente.id_cliente !== clienteId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El empleado  <strong>${clienteNombre}</strong>? ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerClientes(); // Asumiendo que fetchEmpleados() es una función que actualiza la lista de empleados
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message, // Muestra el mensaje de error del backend
      });
    }
  };

  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false)
  };
  const ocultarFormulario = () => {
    setDetalleCliente(null);
    setDetalleCliente(false);
    setFormulario(false);
    setFormData({
      cedula: '',
      nombres: '',
      correo_electronico: '',
      telefono: '',
      direccion: ''
    });
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
              <span className="cantidad-empleados">{clientes.length}</span>
              Lista de Clientes
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
        <thead>
          <tr>
            <th className="a1">Nombre del punto de venta</th>
            <th className="a1">Cedula</th>
            <th className="a1">Telefono y direccion</th>
            <th className="a1">Email</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr className="fila" key={index}>
              <td className="a2">
                <div className="centered-content">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {capitalizeWords(cliente.nombres)}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {cliente.cedula}
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  <div className="contacto">
                    <span>{cliente.telefono}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#636363' }}> {cliente.direccion}</span>
                  </div>
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <LocalPostOfficeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {cliente.correo_electronico}
                </div>
              </td>
              <td className="a10">

                <IconButton onClick={() => setSubMenu(cliente.id_cliente)}>
                  <MoreVertIcon
                  />
                </IconButton >
                {subMenu === cliente.id_cliente && (
                  <div className="sub_menu" onMouseLeave={ocultarSubMenu}>
                    <div onClick={() => obtenerClientePorId(cliente.id_cliente)}>
                      <IconButton size="small" color="success">
                        <InfoIcon />
                      </IconButton>
                      <span>Detalles</span>
                    </div>

                    <div onClick={() => activarModoEdicion(cliente)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <span>Editar</span>
                    </div>

                    <div onClick={() => eliminarCliente(cliente.id_cliente, cliente.nombres)}>
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


      <Modal
        open={formulario}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_form }}>
          <form className="grid-form" onSubmit={enviarForm}>
            <h2 className="title-form">{modoEditar ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Cedula"
                name="cedula"
                onChange={cambiosInputs}
                value={formData.cedula}
                error={cedulaError}
                helperText={cedulaError ? 'Solo se permiten números ' : ''}
                required
              />
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                onChange={cambiosInputs}
                value={formData.nombres}
                error={nombresError}
                helperText={nombresError ? 'Solo se permiten letras de la (A) a la (Z)' : ''}
                required
              />
              <TextField
                fullWidth
                label="Correo Electronico"
                name="correo_electronico"
                onChange={cambiosInputs}
                value={formData.correo_electronico}
                error={correoError}
                helperText={correoError ? 'El correo es invalido!' : ''}
                required

              />
              <TextField
                fullWidth
                label="Telefono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                error={telefonoError}
                helperText={telefonoError ? 'Solo números permitidos' : ''}
                required
              />
              <TextField
                fullWidth
                label="Direccion"
                name="direccion"
                onChange={cambiosInputs}
                value={formData.direccion}
                error={false}
                required
              />
            </div>

            <div className="contain-btns">
              <Button
                variant="outlined"
                color="error"
                onClick={ocultarFormulario}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                type="submit"
              > {modoEditar ? 'Guardar cambios' : 'Agregar Cliente'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleCliente)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleCliente && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles del cliente</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Cedula</strong>
                    <span className="detalle_valor">{detalleCliente.cedula}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Nombres</strong>
                    <span className="detalle_valor">{capitalizeWords(detalleCliente.nombres)}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <LocalPostOfficeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Correo Electrónico</strong>
                    <span className="detalle_valor">{detalleCliente.correo_electronico}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <PhoneIphoneOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Teléfono</strong>
                    <span className="detalle_valor">{detalleCliente.telefono}</span>
                  </div>
                </div>
                <div className="detalle_item google">
                  <PlaceIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Dirección</strong>
                    <span className="detalle_valor">{detalleCliente.direccion}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>

    </section >


  );
};

export default Clientes;
