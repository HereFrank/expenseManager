import React, {useState, useContext, useEffect } from 'react';
import {auth} from '../firebase/firebaseConfig';

//Creando el contexto
const AuthContext = React.createContext();

//Hook para acceder al contexto
const useAuth = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
    const [usuario, cambiarUsuario] = useState();

    //Creando un State para saber cuando termina de cargar la comprobación de onAuthStateChanged
    const [cargando, cambiarCargando] = useState(true);


    //Efecto para comprobar el usuario una sola vez
    useEffect(() => {
        //Comprobando si hay usuario
        //Está función te permite realizar una acción cuando el usuario inicia o cierra sesión
        // Dicha función regresa un valor que al ser llamado como función hace que se cierre la sesión
        const cancelarSuscripcion = auth.onAuthStateChanged((usuario) => {
            //Colocando todos los valores del usuario obtenidos por firebase en tu variable de estado
            //Si no se encuentra ningun usuario con sesión activa usuario == null
            cambiarUsuario(usuario);
            cambiarCargando(false);
        });
        
        //Cancelando suscripción del usuario al desmontar el componente
        return cancelarSuscripcion;
    }, []);
    return (  
        //Recuerda que "value" es el valor que deseas poder proveer a todas las páginas de tu aplicación
        <AuthContext.Provider value={{usuario: usuario}}>
            {/* Solamente retornamos los elementos hijos cuando no este cargando. 
			De esta forma nos aseguramos de no cargar el resto de la app hasta que el usuario haya sido establecido.
			
			Si no hacemos esto al refrescar la pagina el componente children intenta cargar inmediatamente, 
			antes de haber comprobado que existe un usuario. */}
            {!cargando && children}
        </AuthContext.Provider>
    );
}
 
export {AuthProvider, AuthContext, useAuth};