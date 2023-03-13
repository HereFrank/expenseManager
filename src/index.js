import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import WebFont from 'webfontloader';
import Contenedor from './elementos/Contenedor';
//Importando todo lo necesario para crear tus rutas
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import EditarGasto from './componentes/EditarGasto';
import GastosPorCategoria from './componentes/GastosPorCategoria';
import InicioSesion from './componentes/InicioSesion';
import ListaDeGastos from './componentes/ListaDeGastos';
import RegistroUsuarios from './componentes/RegistroUsuarios';
import {Helmet} from 'react-helmet';
//Por alguna razón esta ruta no funciona
import favicon from './img/logo.png';
import Fondo from './elementos/Fondo';
import {AuthProvider} from './contextos/AuthContext';
import RutaPrivada from './componentes/RutaPrivada';
import {TotalGastadoProvider} from './contextos/TotalGastadoEnElMesContext';

WebFont.load({
  //Work+Sans:wght@400;500;700
  google: {
    families: ['Work Sans:400,500,700', 'sans-serif']
  }
});

const Index = () => {
  return (  
    <>
      {/* Aquí pones las etiquetas del head */}
      <Helmet>
        {/* Creando tu icono de acceso directo, esta imagen no quiere cargar por alguna razón */}
        <link rel="shortcut icon" href={favicon} type="image/x-icon"/>
      </Helmet>

      <AuthProvider>
        <TotalGastadoProvider>
          <BrowserRouter>
            <Contenedor>
              {/* Aquí colocas todas las rutas de tu aplicación */}
              <Switch>
                <Route path="/iniciar-sesion" component={InicioSesion}/>
                <Route path="/crear-cuenta" component={RegistroUsuarios}/>

                {/* Aquí solo pueden acceder los que han iniciado sesión */}
                <RutaPrivada path="/categorias">
                  <GastosPorCategoria/>
                </RutaPrivada>
                <RutaPrivada path="/lista">
                  <ListaDeGastos/>
                </RutaPrivada>
                <RutaPrivada path="/editar/:id">
                  <EditarGasto/>
                </RutaPrivada>
                <RutaPrivada path="/">
                  <App/>
                </RutaPrivada>
              </Switch> 
            </Contenedor>
          </BrowserRouter>
        </TotalGastadoProvider>
      </AuthProvider>

      <Fondo/>
    </>
  );
}

ReactDOM.render( <Index/> ,document.getElementById('root'));
