import React from 'react';
import {useAuth} from '../contextos/AuthContext';
import { Route, Redirect } from 'react-router-dom';
// El valor "restoDePropiedades" es para extraer todas las propiedades del componente RutaPrivada
const RutaProtegida = ({children, ...restoDePropiedades}) => {
    const {usuario} = useAuth();

    if (usuario) {
        return <Route {...restoDePropiedades}>{children}</Route>
    } else {
        return <Redirect to="/iniciar-sesion"/>
    }
}
 
export default RutaProtegida;