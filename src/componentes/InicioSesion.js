import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import {Header, Titulo, ContenedorHeader} from '../elementos/Header';
import Boton from '../elementos/Boton';
import {Formulario, Input, ContenedorBoton} from '../elementos/ElementosDeFormulario';
import {ReactComponent as SvgLogin} from '../img/login.svg';
import styled from 'styled-components';
import {useHistory} from 'react-router-dom';
import Alerta from '../elementos/Alerta';
import {auth} from '../firebase/firebaseConfig';

const Svg = styled(SvgLogin)`
    width: 100%;
    max-height: 12.5rem; /* 200px */
    margin-bottom: 1.25rem; /* 20px */

`

const InicioSesion = () => {
    const history = useHistory();
    const [correo, establecerCorreo] = useState('');
    const [password, establecerPassword] = useState('');
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({})

    const handleChange = (event) => {
        if(event.target.name === 'email') {
            establecerCorreo(event.target.value);
        } else if (event.target.name === 'password') {
            establecerPassword(event.target.value);
        }
    } 

    // Aquí usas "async" para indicar de antemano que handleSubmit es una función asincrona, de esta manera puedes usar el awai más adelante
    const handleSubmit = async (event) => {
        //Esto se usa para que al enviar los datos no se refresque la página
        event.preventDefault();

        //Asegurandonos que los estados tienen su valor por defecto
        cambiarEstadoAlerta(false);
        cambiarAlerta({});

        //Comprobando del lado del cliente que el correo sea válido. (Esto se puede hacer del lado del servidor con firebase)
        const expresionRegular= /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
        
        //Usando la expresión regular para comprobar tu correo
        if ( !expresionRegular.test(correo) ){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor ingrese un correo electronico válido'
            })
            return;
        }

        if (correo === '' || password === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellena los datos'
            })
            return;
        }

        //Iniciando sesion de el usuario en firebase
        try {
            await auth.signInWithEmailAndPassword(correo, password)
            history.push('/')
        } catch(error) {
            cambiarEstadoAlerta(true);

            let mensaje;
            switch(error.code){
                case 'auth/wrong-password':
                    mensaje = 'La constraseña no es correcta'
                break;
                case 'auth/user-not-found':
                    mensaje = 'No se encontró ninguna cuenta con este correo electrónico'
                break;
                default:
                    mensaje = 'Hubo un error al intentar crear la cuenta.'
                break;
            }
            cambiarAlerta({tipo: 'error', mensaje: mensaje});
        }
    }

    return (  
    <>
        <Helmet>
            <title>Iniciar Sesion</title>
        </Helmet>

        <Header>
            <ContenedorHeader>
                <Titulo>Iniciar Sesion</Titulo>
                <div>
                    <Boton to="/crear-cuenta">Registrarse</Boton>
                </div>
            </ContenedorHeader>
        </Header>

        <Formulario onSubmit={handleSubmit}>
            <Svg/>
            <Input
                type="email"
                name="email"
                placeholder="Correo Electronico"    
                value={correo}
                onChange={handleChange}       
            />
            <Input
                type="password"
                name="password"
                placeholder="Contraseña" 
                value={password}
                onChange={handleChange}          
            />
            <ContenedorBoton>
                <Boton as="button" primario type="submit">Iniciar Sesion</Boton>
            </ContenedorBoton>
        </Formulario>

        <Alerta 
            tipo={alerta.tipo}
            mensaje={alerta.mensaje}
            estadoAlerta={estadoAlerta}
            cambiarEstadoAlerta={cambiarEstadoAlerta}
        />
    </>
    );
}
 
export default InicioSesion;