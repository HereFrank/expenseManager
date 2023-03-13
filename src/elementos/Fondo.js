import React from 'react';
import styled from 'styled-components';

//El "as" es para cargar los puntos (o sea, el archivo SVG) como un componente
import {ReactComponent as Puntos} from '../img/puntos.svg';

const Svg = styled.svg`
    height: 50vh;
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 0;
    path {
        fill: rgba(135,182,194, .15);
    }
`;
 
const PuntosArriba = styled(Puntos)`
    position: fixed;
    z-index: 1;
    top: 2.5rem; /* 40px */
    left: 2.5rem; /* 40px */
`;
 
const PuntosAbajo = styled(Puntos)`
    position: fixed;
    z-index: 1;
    bottom: 2.5rem; /* 40px */
    right: 2.5rem; /* 40px */
`;

const Fondo = () => {
    return (  
        <>
            <PuntosArriba/>
            <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path  
                    fillOpacity="1" 
                    d="M0,128L60,154.7C120,181,240,235,360,224C480,213,600,139,720,101.3C840,64,960,64,1080,90.7C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
                </path>
            </Svg>
            <PuntosAbajo/>
        </>
    );
}
 
export default Fondo;