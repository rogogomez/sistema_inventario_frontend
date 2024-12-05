import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import Context from "../contexto/Context";

const useInactivity = (
  tiempoMaximoInactividad = 60 * 60 * 1000,
  tiempoMensaje = 30 * 1000
) => {
  const { logueado } = useContext(Context);
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    if (!logueado) return;

    let inactivityTimer;
    let warningTimer;
    let swalInstance;

    // Función para reiniciar el temporizador de inactividad
    const reiniciarTemporizador = () => {
      setIsInactive(false);
      clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        setIsInactive(true);
        mostrarAdvertencia();
      }, tiempoMaximoInactividad);
    };

    // Mostrar el mensaje de advertencia
    const mostrarAdvertencia = () => {
      swalInstance = Swal.fire({
        icon: "warning",
        title: "Inactividad detectada",
        text: "Tu sesión se cerrará en 30 segundos si no realizas alguna acción.",
        confirmButtonText: "Seguir navegando",
        cancelButtonText: "Cerrar sesión",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        timer: tiempoMensaje,
        timerProgressBar: true,
      }).then((result) => {
        if (result.isConfirmed) {
          reiniciarTemporizador();
        } else {
          redirigirLogin();
        }
      });

      // Solo se ejecuta si no hay interacción durante el tiempo de advertencia
      warningTimer = setTimeout(() => {
        if (swalInstance.isVisible()) {
          swalInstance.close();
          redirigirLogin();
        }
      }, tiempoMensaje);
    };

    const redirigirLogin = () => {
      window.location.href = "/";
    };

    // Detectar actividad en la página
    window.addEventListener("mousemove", reiniciarTemporizador);
    window.addEventListener("keydown", reiniciarTemporizador);
    window.addEventListener("click", reiniciarTemporizador);

    reiniciarTemporizador();

    // Limpieza de los event listeners y temporizadores
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      window.removeEventListener("mousemove", reiniciarTemporizador);
      window.removeEventListener("keydown", reiniciarTemporizador);
      window.removeEventListener("click", reiniciarTemporizador);
    };
  }, [logueado, tiempoMaximoInactividad, tiempoMensaje]);
};

export default useInactivity;
