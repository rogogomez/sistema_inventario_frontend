import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Box, Button, IconButton, Modal, TextField, Select, MenuItem, FormControl, InputLabel, InputBase, InputAdornment } from "@mui/material";

// import CheckIcon from '@mui/icons-material/Check';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DescriptionIcon from '@mui/icons-material/Description';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';


import Context from "../contexto/Context";
import PropTypes from 'prop-types';



const Productos = ({ userRole }) => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const { usuario } = useContext(Context);

  const [operacion, setOperacion] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [formStock, setFormStock] = useState(false)
  const [subMenu, setSubMenu] = useState(false)
  const [busqueda, setBusqueda] = useState('');
  const [productoID, setProductoID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [bodegas, setBodegas] = useState([]);
  const [formData, setFormData] = useState({
    bodega: '',
    nombre: '',
    referencia: '',
    descripcion: '',
    precio_venta: '',
    cantidad: '',
  });
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const productosPorPagina = 10; // Cantidad de productos por página

  // Filtrar los productos según la búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.bodega.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.referencia.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Calcular los productos que se deben mostrar en la página actual
  const productosMostrados = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  // Función para cambiar de página
  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
  };

  // Número total de páginas
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

  // Activar el modo de edición y configurar el formulario con datos del producto seleccionado
  const activarModoEdicion = (producto) => {
    const bodega = bodegas.find(b => b.id_bodega === producto.bodega);
    setModoEditar(true);
    setFormulario(true);
    setFormData({
      bodega: bodega ? bodega.id_bodega : '',
      nombre: producto.nombre,
      referencia: producto.referencia,
      descripcion: producto.descripcion,
      precio_venta: producto.precio_venta,
      cantidad: producto.cantidad,
    });
    setProductoID(producto.id_producto);  // Guardar ID del producto seleccionado
  };

  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const obtenerProductos = async () => {
    try {
      // Mostrar mensaje de carga
      Swal.fire({
        title: "Cargando productos...",
        text: "Por favor, espera mientras se cargan los productos.",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`${apiUrl}/productos`);
      if (response.ok) {
        const data_productos = await response.json();
        // Ordenar los productos alfabéticamente por el nombre
        const productosOrdenados = data_productos.sort((a, b) => {
          if (a.nombre < b.nombre) {
            return -1; // Si a es alfabéticamente antes que b, a va primero
          }
          if (a.nombre > b.nombre) {
            return 1; // Si a es alfabéticamente después que b, b va primero
          }
          return 0; // Si ambos son iguales, no hay cambio
        });

        setProductos(productosOrdenados); // Asignar los productos ordenados al estado

        // Cerrar el mensaje de carga
        Swal.close();

      } else {
        // Cerrar el mensaje de carga
        Swal.close();

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener los productos. Inténtalo de nuevo.",
        });
      }
    } catch (error) {
      // Cerrar el mensaje de carga en caso de error
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar obtener los productos.",
      });
    }
  };




  const obtenerBodegas = async () => {
    try {
      // Mostrar mensaje de carg

      const response = await fetch(`${apiUrl}/bodegas`);
      if (response.ok) {
        const data_bodegas = await response.json();
        setBodegas(data_bodegas);

      } else {
        // Cerrar el mensaje de carga

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener las bodegas. Inténtalo de nuevo.",
        });
      }
    } catch (error) {
      // Cerrar el mensaje de carga en caso de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al intentar obtener las bodegas.",
      });
    }
  };


  useEffect(() => {
    obtenerProductos();
    obtenerBodegas();
  }, []);



  const enviarForm = async (e) => {
    e.preventDefault();
    try {
      // Mostrar mensaje de carga mientras se procesan los datos
      Swal.fire({
        title: 'Procesando...',
        text: 'Por favor espera mientras se guarda el producto.',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      let url = `${apiUrl}/productos`;
      let method = 'POST';



      if (modoEditar) {
        url += `/${productoID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      });

      Swal.close();

      if (response.status === 400) {
        const data = await response.json();
        if (data.error && data.error === "REGISTRO_DUPLICADO") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al intentar agregar o actualizar el producto. Inténtalo de nuevo.',
          });
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al agregar o actualizar el producto: ${errorData.message}`,
        });
        return;
      }

      if (modoEditar) {
        Swal.fire({
          title: 'Producto Actualizado',
          text: 'El producto ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Producto Agregado',
          text: 'El producto ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerProductos();
    } catch (error) {
      // Manejo de errores generales
      Swal.close();  // Cerrar el mensaje de carga si ocurre un error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al intentar guardar el producto. Inténtalo de nuevo.',
      });
    }
  };

  const obtenerProductoPorId = async (idProducto) => {
    try {
      const response = await fetch(`${apiUrl}/productos/${idProducto}`);
      if (response.ok) {
        const data = await response.json();

        const bodega = bodegas.find(b => b.id_bodega === data.bodega);

        setDetalleProducto({
          ...data,
          bodega: bodega ? bodega.nombres : 'Desconocida',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el producto. Inténtalo de nuevo.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al intentar obtener el producto.',
      });
    }
  };




  const eliminarProducto = async (productoId, productoNombre) => {
    if (usuario.cargo !== 'administrador') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para eliminar productos.',
      });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Eliminar producto",
        html: `¿Seguro que quieres eliminar a <strong>${productoNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`${apiUrl}/productos/${productoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setProductos(
          productos.filter((producto) => producto.id_producto !== productoId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El producto <strong>${productoNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerProductos();
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
    setDetalleProducto(null);
    setFormulario(false);
    setFormData({
      proveedor: '',
      bodega: '',
      nombre: '',
      referencia: '',
      descripcion: '',
      precio_venta: '',
      cantidad: '',
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
    overflowY: 'auto',
    borderRadius: '10px',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      pt: 0,
      px: 0,
      pb: 0,
      minHeight: '100vh',
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


  const ocultarSubMenu = () => {
    setSubMenu(false)
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => capitalize(word)).join(' ');
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Codigo para actualizar o sumar stock a un producto



  const handleNuevoStock = (e) => {
    setNuevaCantidad(e.target.value);
  };

  const ocultarFormularioStock = () => {
    setFormStock(false);
    setNuevaCantidad('');
  };

  // Función para manejar la cantidad y tipo de operación (sumar o restar)
  const actualizarCantidad = async (idProducto, nuevaCantidad, operacion) => {
    try {
      // Llama al backend con la cantidad y operación seleccionada
      const response = await fetch(`${apiUrl}/productos/${idProducto}/cantidad`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaCantidad: parseInt(nuevaCantidad), operacion }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la cantidad');
      }

      Swal.fire({
        title: 'Stock Actualizado',
        text: 'La cantidad de stock ha sido actualizada correctamente.',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false,
      });

      setNuevaCantidad(''); // Limpia el campo de cantidad
      setFormStock(false);  // Cierra el formulario
      obtenerProductos();   // Refresca la lista de productos

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el stock.',
      });
    }

    ocultarFormularioStock(); // Oculta el formulario
  };

  // Mostrar el formulario para sumar o restar
  const mostrarFormularioStock = (idProducto, operacion) => {
    setOperacion(operacion);  // Establece si es 'sumar' o 'restar'
    setFormStock(idProducto);       // Abre el formulario
  };


  return (
    <>


      <section className="section-item">
        <section className="contenedor_buscar">
          <div className="witches a1">
            <ul className="witches-list">
              <li className="witches-item">
                <span className="cantidad-empleados">{productos.length}</span>
                Listado de los productos
              </li>

            </ul>
          </div>
          <div>

            <InputBase
              sx={{
                width: 'auto',
                borderRadius: '14px',
                backgroundColor: '#ebf0f4',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                paddingLeft: '10px',
                fontSize: '1.2rem',
                marginRight: '10px',
              }}
              placeholder="Buscar productos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#949393', fontSize: '1.5rem', }} />
                </InputAdornment>
              }
            />

          </div>

          {(userRole !== 'vendedor') && (
            <div>
              <IconButton
                color="primary"
                onClick={mostarFormulario}
                style={{ background: 'var(--tercero)' }}>
                <AddIcon style={{ color: 'var(--primer)', fontSize: '1rem' }} />
              </IconButton>
            </div>
          )}

        </section >



        <table className="tabla-items">
          <thead>
            <tr>
              <th className="a1">Bodega</th>
              <th className="a1">Nombre</th>
              <th className="a1">Referencia</th>
              <th className="a1">Descripcion</th>
              <th className="a1">Precio</th>
              <th className="a1">Stock</th>
              <th className="a1"></th>
              <th className="a1"></th>
            </tr>
          </thead>
          <tbody>
            {productosMostrados
              .filter((producto) =>
                producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.bodega.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.referencia.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((producto, index) => (
                <tr className="fila" key={index}>
                  <td className="a1">
                    <div className="centered-content">
                      <LocationOnIcon style={{ color: '#949393', fontSize: '2rem' }} />
                      {producto.bodega}
                    </div>
                  </td>


                  <td className="a2">
                    <div className="centered-content">
                      <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                      {capitalizeWords(producto.nombre)}
                    </div>
                  </td>

                  <td className="a2">
                    <div className="centered-content">
                      <QrCodeIcon style={{ color: '#949393', fontSize: '2rem' }} />
                      {capitalizeWords(producto.referencia)}
                    </div>
                  </td>

                  <td className="a1">
                    <div className="centered-content">
                      <DescriptionIcon style={{ color: '#949393', fontSize: '2rem' }} />
                      {capitalizeWords(producto.descripcion)}
                    </div>
                  </td>


                  <td className="a2">
                    <div className="centered-content">
                      <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                      {producto.precio_venta}
                    </div>
                  </td>
                  <td
                    className={producto.cantidad === 0 ? 'agotado' : userRole === 'vendedor' ? '' : ''}
                  >
                    <div

                      className="centered-content">
                      <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                      <strong>{producto.cantidad}
                      </strong>
                    </div>

                  </td>


                  {/* codigo para actualiza stock */}
                  {(userRole !== 'vendedor') && (

                    <td className="actualizarStock">
                      <div className="centered-content">
                        <IconButton onClick={() => mostrarFormularioStock(producto.id_producto, 'restar')}>
                          <HorizontalRuleIcon />
                        </IconButton>
                        <IconButton onClick={() => mostrarFormularioStock(producto.id_producto, 'sumar')}>
                          <AddIcon />
                        </IconButton>
                        {formStock === producto.id_producto && (
                          <div className="formStock">
                            <label>Insertar Cantidad</label>
                            <TextField
                              value={nuevaCantidad}
                              onChange={handleNuevoStock}
                            />
                            <div className="check">
                              <IconButton
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() => actualizarCantidad(producto.id_producto, nuevaCantidad, operacion)}

                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                size="small"

                                color="secondary"
                                onClick={ocultarFormularioStock}
                                variant="outlined"
                              >
                                <ClearIcon />
                              </IconButton>
                            </div>

                          </div>
                        )}
                      </div>
                    </td>

                  )}


                  {(userRole === 'administrador') && (
                    <td className="a10">
                      <div className="centered-content">
                        <IconButton onClick={() => setSubMenu(producto.id_producto)}>
                          <MoreVertIcon />
                        </IconButton>
                        {subMenu === producto.id_producto && (
                          <div className="sub_menu" onMouseLeave={ocultarSubMenu}>

                            <div onClick={() => obtenerProductoPorId(producto.id_producto)}>
                              <IconButton size="small" color="success">
                                <InfoIcon />
                              </IconButton>
                              <span>Detalles</span>
                            </div>

                            <div onClick={() => activarModoEdicion(producto)}>
                              <IconButton size="small" color="primary">
                                <EditIcon />
                              </IconButton>
                              <span>Editar</span>
                            </div>

                            <div onClick={() => eliminarProducto(producto.id_producto, producto.nombre)}>
                              <IconButton size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                              <span>Eliminar</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  )}



                </tr>
              ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="paginacion">
          <Button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            variant="outlined"
            size="small"
          >
            Anterior
          </Button>
          <span>{`Página ${paginaActual} de ${totalPaginas}`}</span>
          <Button
            variant="outlined"
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            size="small"
          >
            Siguiente
          </Button>
        </div>

        <Modal
          open={formulario}
          onClose={ocultarFormulario}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          closeAfterTransition
        >
          <Box sx={{ ...style_form }}>
            <form className="grid-form" onSubmit={enviarForm}>
              <h2 className="title-form">{modoEditar ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
              <div className="contain-inputs">
                <TextField
                  fullWidth
                  label="Referencia"
                  name="referencia"
                  onChange={cambiosInputs}
                  value={formData.referencia}
                  required
                />
                <TextField
                  fullWidth
                  label="Nombre del producto"
                  name="nombre"
                  onChange={cambiosInputs}
                  value={formData.nombre}
                  required
                />
                <TextField
                  type="number"
                  fullWidth
                  label="Cantidad"
                  name="cantidad"
                  onChange={cambiosInputs}
                  value={formData.cantidad}
                  required
                />
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  onChange={cambiosInputs}
                  value={formData.descripcion}
                  required
                />

                <TextField
                  type="number"
                  fullWidth
                  label="Precio de Venta"
                  name="precio_venta"
                  onChange={cambiosInputs}
                  value={formData.precio_venta}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel id="bodega-label">Ubicación</InputLabel>
                  <Select
                    labelId="bodega-label"
                    name="bodega"
                    value={formData.bodega}
                    onChange={cambiosInputs}
                    required
                  >
                    {bodegas.map((bodega) => (
                      <MenuItem key={bodega.id_bodega} value={bodega.id_bodega}>
                        {bodega.nombres}
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
                > {modoEditar ? 'Guardar cambios' : 'Agregar producto'}
                </Button>
              </div>
            </form>
          </Box>
        </Modal>

        <Modal
          open={Boolean(detalleProducto)}
          onClose={ocultarFormulario}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style }}>
            {detalleProducto && (
              <div className="contenedor_detalle">
                <div className="cerrar-boton">
                  <h2 className="titulo-detalle">Detalles del Producto</h2>
                  <IconButton onClick={ocultarFormulario}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <div className="contenedor-detalles">


                  <div className="detalle_item">
                    <LocationOnIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Ubicación</strong>
                      <span className="detalle_valor">{detalleProducto.bodega}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Nombre</strong>
                      <span className="detalle_valor">{capitalizeWords(detalleProducto.nombre)}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <QrCodeIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Referencia</strong>
                      <span className="detalle_valor">{capitalizeWords(detalleProducto.referencia)}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <DescriptionIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Descripción</strong>
                      <span className="detalle_valor">{capitalizeWords(detalleProducto.descripcion)}</span>
                    </div>
                  </div>

                  <div className="detalle_item">
                    <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Precio de Venta</strong>
                      <span className="detalle_valor">{detalleProducto.precio_venta}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Cantidad</strong>
                      <span className="detalle_valor">{detalleProducto.cantidad}</span>
                    </div>
                  </div>


                </div>
              </div>
            )}
          </Box>
        </Modal>
      </section>
    </>
  );
};

Productos.propTypes = {
  userRole: PropTypes.string.isRequired,
};

export default Productos;