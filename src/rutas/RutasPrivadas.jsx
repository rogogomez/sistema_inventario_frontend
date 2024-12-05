
import { useContext } from "react"
import Context from "../contexto/Context"
import { Navigate } from "react-router-dom"

const RutasPrivadas = ({ children }) => {

    const { logueado } = useContext(Context)

    return (logueado)
        ? children
        : <Navigate to='/login' />
}



export default RutasPrivadas