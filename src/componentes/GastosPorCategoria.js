import React from 'react';
import {Header, Titulo} from '../elementos/Header';
import {Helmet} from 'react-helmet';
import BtnRegresar from '../elementos/BtnRegresar';
import BarraTotalGastado from './BarraTotalGastado';
import useObtenerGastosDelMesPorCategoria from '../hooks/useObtenerGastosDelMesPorCateogria';
import {ListaDeCategorias, ElementoListaCategorias, Categoria, Valor} from '../elementos/ElementosDeLista';
import IconoCategoria from '../elementos/IconoCategoria';
import convertirAMoneda from '../funciones/convertirAMoneda';

const GastosPorCategoria = () => {
    const gastosPorCategoria = useObtenerGastosDelMesPorCategoria();
    
    console.log(gastosPorCategoria);

    return (  
    <>
      <Helmet>
        <title>Gastos por categoría</title>
      </Helmet>

      <Header>
          <BtnRegresar/>
          <Titulo>Gastos por categoría</Titulo>
      </Header>

      <ListaDeCategorias>
        {gastosPorCategoria.map((elemento, index) => {
          return(
            <ElementoListaCategorias key={index}>
              <Categoria>
                <IconoCategoria id={elemento.categoria}/>
                {elemento.categoria}
              </Categoria>
              <Valor>{convertirAMoneda(elemento.cantidad)}</Valor>
            </ElementoListaCategorias>
          );
        })}
      </ListaDeCategorias>

      <BarraTotalGastado/>
    </>
    );
}
 
export default GastosPorCategoria;