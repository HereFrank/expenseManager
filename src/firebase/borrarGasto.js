import {db} from '../firebase/firebaseConfig';


const borrarGasto = (id) => {
    db.collection('gastos').doc(id).delete();
}
 
export default borrarGasto;