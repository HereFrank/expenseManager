import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import {Header, Titulo, ContenedorHeader} from '../elementos/Header';
import Boton from '../elementos/Boton';
import {Formulario, Input, ContenedorBoton} from '../elementos/ElementosDeFormulario';
import {ReactComponent as SvgLogin} from '../img/registro.svg';
import styled from 'styled-components';
import {auth} from '../firebase/firebaseConfig';
import {useHistory} from 'react-router-dom';
import Alerta from '../elementos/Alerta';

const Svg = styled(SvgLogin)`
    width: 100%;
    max-height: 6.25rem; /* 100px */
    margin-bottom: 1.25rem; /* 20px */

`
const RegistroUsuarios = () => {
    const history = useHistory();
    const [correo, establecerCorreo] = useState('');
    const [password, establecerPassword] = useState('');
    const [password2, establecerPassword2] = useState('');
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({})

    const handleChange = (event) => {
        switch(event.target.name){
            case 'email':
                establecerCorreo(event.target.value);
                break;
            case 'password':
                establecerPassword(event.target.value);
                break;
            case 'password2':
                establecerPassword2(event.target.value);
                break;  
            default:
                break;
        }
    }

    const handleSubmit = async (event) => {
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

        if (correo === '' || password === '' || password2 === ''){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellena los datos'
            })
            return;
        }

        if(password !== password2){
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Las contraseñas no son iguales'
            })
            return;
        }

        //Creando el usuario en firebase
        try {
            await auth.createUserWithEmailAndPassword(correo, password)
            history.push('/')
        } catch(error) {
            cambiarEstadoAlerta(true);

            let mensaje;
            switch(error.code){
                case 'auth/invalid-password':
                    mensaje = 'La contraseña tiene que ser de al menos 6 caracteres.'
                    break;
                case 'auth/email-already-in-use':
                    mensaje = 'Ya existe una cuenta con el correo electrónico proporcionado.'
                break;
                case 'auth/invalid-email':
                    mensaje = 'El correo electrónico no es válido.'
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
            <title>Crear Cuenta</title>
        </Helmet>

        <Header>
            <ContenedorHeader>
                <Titulo>Crear Cuenta</Titulo>
                <div>
                    <Boton to="/iniciar-sesion">Iniciar Sesion</Boton>
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
            <Input
                type="password"
                name="password2"
                placeholder="Repetir la contraseña"
                value={password2}
                onChange={handleChange} 

            />
            <ContenedorBoton>
                <Boton as="button" primario type="submit">Crear Cuenta</Boton>
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
 
export default RegistroUsuarios;