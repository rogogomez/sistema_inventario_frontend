
import { Box, Button, IconButton, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import StoreIcon from '@mui/icons-material/Store';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const PuntosVenta = () => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [puntoVentaID, setPuntoVentaID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detallePuntoVenta, setDetallePuntoVenta] = useState(null)
  const [puntosVentas, setPuntosVentas] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombre_punto_venta: '',
    telefono: '',
    direccion: '',
    encargado: ''
  });


  const activarModoEdicion = (puntoVenta) => {
    setModoEditar(true);
    setFormulario(true);
    // Encontrar el encargado basado en el ID almacenado en puntoVenta.encargado
    const encargadoSeleccionado = empleados.find(emp => emp.id_empleado === puntoVenta.encargado);

    setFormData({
      nombre_punto_venta: puntoVenta.nombre_punto_venta,
      telefono: puntoVenta.telefono,
      direccion: puntoVenta.direccion,
      encargado: encargadoSeleccionado ? encargadoSeleccionado.id_empleado : '',
    });
    setPuntoVentaID(puntoVenta.id_punto_venta);
  };


  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerPuntosVentas = async () => {
    try {
      // Mostrar mensaje de carga
      Swal.fire({
        title: "Cargando puntos de venta...",
        text: "Por favor, espera mientras se cargan los puntos de venta.",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`${apiUrl}/puntos_ventas`);
      if (response.ok) {
        const data_ventas = await response.json();
        setPuntosVentas(data_ventas);

        // Cerrar el mensaje de carga y mostrar mensaje de éxito
        Swal.close();
        Swal.fire({
          title: 'Éxito',
          text: 'Los puntos de venta se han cargado correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Cerrar el mensaje de carga y mostrar mensaje de error
        Swal.close();
        Swal.fire({
          title: 'Error al Cargar Puntos de Venta',
          text: 'No se pudo obtener la lista de puntos de venta. Intenta nuevamente.',
          icon: 'error',
          showConfirmButton: true
        });
      }
    } catch (error) {
      // Cerrar el mensaje de carga y mostrar mensaje de error de conexión
      Swal.close();
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Hubo un problema al intentar obtener los puntos de venta. Por favor, intenta nuevamente.',
        icon: 'error',
        showConfirmButton: true
      });
    }
  };


  const obtenerEmpleados = async () => {
    try {
      const response = await fetch(`${apiUrl}/empleados`);
      if (response.ok) {
        const data_empleados = await response.json();
        setEmpleados(data_empleados);
      } else {
        console.error("No se pudo obtener los empleados");
      }
    } catch (error) {
      console.error('error al obtener los empleados', error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
    obtenerPuntosVentas()
  }, []);



  const enviarForm = async (e) => {
    e.preventDefault();

    try {
      let url = `${apiUrl}/puntos_ventas`;
      let method = 'POST';
      if (modoEditar) {
        url += `/${puntoVentaID}`;
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
        // const data = await response.json();
        console.error('Error al agregar o actualizar el punto de venta');
        return;
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el punto de venta');
        return;
      }

      // const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Punto de Venta Actualizado',
          text: 'El punto de venta ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Punto de Venta Agregado',
          text: 'El punto de venta ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerPuntosVentas();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };

  const obtenerPuntoVentaPorId = async (idPuntoVenta) => {
    try {
      const response = await fetch(`${apiUrl}/puntos_ventas/${idPuntoVenta}`);
      if (response.ok) {
        const data = await response.json();
        const encargado = empleados.find(emp => emp.id_empleado === data.encargado);
        setDetallePuntoVenta({ ...data, encargado: encargado ? encargado.nombres : 'Desconocido' });
      } else {
        console.error("No se pudo obtener el punto de venta");
      }
    } catch (error) {
      console.error('error al obtener el punto de venta', error);
    }
  };
  const eliminarPuntoVenta = async (puntoVentaId, puntoVentaNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar punto de venta",
        html: `¿Seguro que quieres eliminar a  <strong>${puntoVentaNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/puntos_ventas/${puntoVentaId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setPuntosVentas(
          puntosVentas.filter((puntoVenta) => puntoVenta.id_punto_venta !== puntoVentaId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El punto de venta <strong>${puntoVentaNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerPuntosVentas();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };
  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setDetallePuntoVenta(null);
    setFormulario(false);
    setFormData({
      nombre_punto_venta: '',
      telefono: '',
      direccion: '',
      encargado: ''
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



  return (
    <section className="section-item">
      <div className=" contenedor_buscar">
        <div className="witches">
          <ul className="witches-list ">
            <li className="witches-item">
              <span className="cantidad-empleados">{puntosVentas.length}</span>
              Lista de los puntos de venta

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
            <th className="a1">Telefono y direccion</th>
            <th className="a1">Encargado</th>
          </tr>
        </thead>
        <tbody>
          {puntosVentas.map((puntoVenta, index) => (
            <tr className="fila" key={index}>

              <td className="a2">
                <div className="centered-content">
                  <StoreIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {puntoVenta.nombre_punto_venta}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <ContactsOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  <div className="contacto">
                    <span>{puntoVenta.telefono}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#636363' }}> {puntoVenta.direccion}</span>
                  </div>
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {puntoVenta.encargado}
                </div>
              </td>
              <td className="a10">
                <IconButton onClick={() => setSubMenu(puntoVenta.id_punto_venta)}>
                  <MoreVertIcon />
                </IconButton>
                {subMenu === puntoVenta.id_punto_venta && (
                  <div className="sub_menu" onMouseLeave={ocultarSubMenu}>
                    <div onClick={() => obtenerPuntoVentaPorId(puntoVenta.id_punto_venta)}>
                      <IconButton size="small" color="success">
                        <InfoIcon />
                      </IconButton>
                      <span>Detalles</span>
                    </div>

                    <div onClick={() => activarModoEdicion(puntoVenta)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <span>Editar</span>
                    </div>

                    <div onClick={() => eliminarPuntoVenta(puntoVenta.id_punto_venta, puntoVenta.nombre_punto_venta)}>
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
            <h2 className="title-form">{modoEditar ? 'Editar Punto de Venta' : 'Agregar Punto de Venta'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Nombre del punto de venta"
                name="nombre_punto_venta"
                onChange={cambiosInputs}
                value={formData.nombre_punto_venta}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                onChange={cambiosInputs}
                value={formData.direccion}
                required
              />
              <FormControl fullWidth>
                <InputLabel id="encargado-label">Encargado</InputLabel>
                <Select
                  labelId="encargado-label"
                  name="encargado"
                  value={formData.encargado} // aqui quiero que se me mustre el nombre no el id
                  onChange={cambiosInputs}
                  required
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombres}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


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
              >  {modoEditar ? "Guardar Cambios" : "Agregar Punto de Venta"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={Boolean(detallePuntoVenta)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detallePuntoVenta && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles del punto de venta</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="contenedor-detalles">

                <div className="detalle_item">
                  <StoreIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Nombres del punto de venta</strong>
                    <span className="detalle_valor">{detallePuntoVenta.nombre_punto_venta}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PhoneIphoneOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Teléfono</strong>
                    <span className="detalle_valor">{detallePuntoVenta.telefono}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PlaceIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Dirección</strong>
                    <span className="detalle_valor">{detallePuntoVenta.direccion}</span>
                  </div>
                </div>


                <div className="detalle_item">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Ecargado del punto</strong>
                    <span className="detalle_valor">{detallePuntoVenta.encargado}</span>
                  </div>
                </div>

              </div>

            </div>
          )}
        </Box>
      </Modal>
    </section>
  );
};

export default PuntosVenta;
