import React from 'react';
import {ReactComponent as IconoCerrarSesion} from '../img/log-out.svg';
import Boton from './Boton';
import {auth} from '../firebase/firebaseConfig';
import {useHistory} from 'react-router-dom';

const BotonCerrarSesion = () => {
    const history = useHistory();

    const cerrarSesion = async () => {
        try {
            await auth.signOut();
            history.push('/iniciar-sesion')
        } catch(error) {
            //Aquí no colocó ningún componente de alerta , pues pocas veces tendrás algún error para iniciar sesión
            console.log(error);
        }
    }
    return (  
        //Se coloca la propiedad "as" porque recuerda que el boton es un <Link> y en este caso tu quieres que dicho tag se comporte como un botton en si mismo
        <Boton iconoGrande as="button" onClick={cerrarSesion}>
           <IconoCerrarSesion/> 
        </Boton>
    );
}
 
export default BotonCerrarSesion;
