import { useState, useEffect } from "react";
import {db} from '../firebase/firebaseConfig';
import {startOfMonth, endOfMonth, getUnixTime} from 'date-fns';
import {useAuth} from '../contextos/AuthContext';

const useObtenerGastosDelMes = () => {
    const [gastos, establecerGastos] = useState([]);
    const {usuario} = useAuth();

    useEffect(() => {
        const inicioDeMes = getUnixTime(startOfMonth(new Date()));
        const finDeMes = getUnixTime(endOfMonth(new Date()));

        //Este condicional permite que si el usuario cambia vas a poder contactar otra vez con la base de datos

        if (usuario) {
            const unsuscribe = db.collection('gastos')
            .orderBy('fecha', 'desc')
            .where('fecha', '>=', inicioDeMes)
            .where('fecha', '<=', finDeMes)
            .where('uidUsuario', '==', usuario.uid)
            .onSnapshot((snapshot) => {
                establecerGastos(snapshot.docs.map((documento) => {
                    return {...documento.data(), id: documento.id}
                }))
            }) 
            // useEffect tiene que retornar una función que se va a ejecutar cuando se desmonte el componente
            // En este caso queremos que se ejecute el unsuscribe a la colección de firesotre
            // En conclusión, esto es lo que hará useEffect al demonstar tu componente.
            return unsuscribe
        }
    }, [usuario]);

    return gastos;
}
 
export default useObtenerGastosDelMes;