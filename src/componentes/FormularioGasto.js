import React, {useState, useEffect} from 'react';
import {
    ContenedorFiltros, Formulario,
     Input, InputGrande, ContenedorBoton 
} from '../elementos/ElementosDeFormulario';
import Boton from '../elementos/Boton';
import {ReactComponent as IconoPlus} from '../img/plus.svg';
import SelectCategorias from './SelectCategorias';
import DatePicker from './DatePicker';
import fromUnixTime from 'date-fns/fromUnixTime';
import getUnixTime from 'date-fns/getUnixTime';
import agregarGasto from '../firebase/agregarGasto';
import {useAuth} from '../contextos/AuthContext';
import Alerta from '../elementos/Alerta';
import {useHistory} from 'react-router-dom';
import editarGasto from '../firebase/editarGasto';

const FormularioGasto = ({gasto}) => {
    const [inputDescripcion, cambiarInputDescripcion] = useState('');
    const [inputCantidad, cambiarInputCantidad] = useState('');
    const [categoria, cambiarCategoria] = useState('hogar');
    const [fecha, cambiarFecha] = useState(new Date());
    //Estados necesarios para el componente de Alerta
    const [estadoAlerta, cambiarEstadoAlerta] = useState(false);
    const [alerta, cambiarAlerta] = useState({});


    const {usuario} = useAuth();
    const history = useHistory();

    useEffect(() => {
        //Comprobando si hay un gasto.
        //De ser asi esbleces todo el state con los valores del gasto (todos los valores del formulario se rellenan con los del gasto)
        if (gasto){
            //Comprobando que el gasto sea del usuario actual (por si un usuario listo coloca un gasto que no es el de él)
            // Para esto se comprueba con el uid del gasto contra el uid del usuario 
            if (gasto.data().uidUsuario === usuario.uid) {
                cambiarCategoria(gasto.data().categoria);
                cambiarFecha(fromUnixTime(gasto.data().fecha));
                cambiarInputDescripcion(gasto.data().descripcion);
                cambiarInputCantidad(gasto.data().cantidad);
            } else {
                //Enviandolo a la lista para que seleccione un elemento que si pueda editar
                history.push('/lista');
            }
        }

    }, [gasto, usuario, history]);

    const handleChange = (event) => {
        if(event.target.name === 'descripcion'){
            cambiarInputDescripcion(event.target.value)
        } else if(event.target.name === 'cantidad') {
            // Aquí lo que estás diciendo es que todo lo que no sea número o decimal, se quiere reemplazar por '', es decir, por nada
            cambiarInputCantidad(event.target.value.replace(/[^0-9.]/g, ''))
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        // Transformamos la cantidad en número y le pasamos 2 decimales
        let cantidad = parseFloat(inputCantidad).toFixed(2);

        // Comprobamos que haya una descripción y valor
        if (inputDescripcion !=='' && inputCantidad !== ''){

            //Esta es una validación adicional que caso de que el usuario extrañamente lograra colocar alguna letra en el "inputGrande"
            if (cantidad) {

                // Comprobación de si el usuario quiere editar un gasto
                if (gasto) {
                    editarGasto({
                        id: gasto.id,
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha)
                    }).then(() => {
                        history.push('/lista');
                    }).catch((error) => {
                        console.log(error);
                    })
                } else {
                    agregarGasto({
                        categoria: categoria,
                        descripcion: inputDescripcion,
                        cantidad: cantidad,
                        fecha: getUnixTime(fecha),
                        uidUsuario: usuario.uid
                    })
                    .then(() => {
                        //Limpiando el formulario "agregar gasto"
                        cambiarCategoria('hogar');
                        cambiarInputDescripcion('');
                        cambiarInputCantidad('');
                        cambiarFecha(new Date());
    
                        //Colocando el mensaje de alerta
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'exito',
                            mensaje: 'El gasto fue agregado correctamente'
                        })
                    })
                    .catch((error) => {
                        cambiarEstadoAlerta(true);
                        cambiarAlerta({
                            tipo: 'error',
                            mensaje: 'Hubo un problema al intentar agregar tu gasto'
                        })
                    })
                }
            } else {
                cambiarEstadoAlerta(true);
                cambiarAlerta({
                    tipo: 'error',
                    mensaje: 'El valor que ingresaste no es correcto'
                })
            }
        } else {
            cambiarEstadoAlerta(true);
            cambiarAlerta({
                tipo: 'error',
                mensaje: 'Por favor rellena todos los campos'
            })
        }
    }
    return (  
        <Formulario onSubmit={handleSubmit}>
            <ContenedorFiltros>
                <SelectCategorias
                    categoria={categoria}
                    cambiarCategoria={cambiarCategoria}
                />
                <DatePicker fecha={fecha} cambiarFecha={cambiarFecha}/>
            </ContenedorFiltros>

            <div>
                <Input
                    type="text"
                    name="descripcion"
                    placeholder="Descripción del gasto"
                    value={inputDescripcion}
                    onChange={handleChange}
                />
                <InputGrande 
                    type="text"
                    name="cantidad"
                    placeholder="$0.00"
                    value={inputCantidad}
                    onChange={handleChange}
                />
            </div>
            <ContenedorBoton>
                {/* Cambiando comportamiento de link a un button */}
                <Boton as="button" primario conIcono type="submit">
                    {gasto ? 'Editar Gasto' : 'Agregar Gasto' }<IconoPlus/>
                </Boton>
            </ContenedorBoton>
            <Alerta
                tipo={alerta.tipo}
                mensaje={alerta.mensaje}
                estadoAlerta={estadoAlerta}
                cambiarEstadoAlerta={cambiarEstadoAlerta}
            />
        </Formulario>
    );
}
 
export default FormularioGasto;


