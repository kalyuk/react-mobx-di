import 'reflect-metadata';
import * as React from 'react';
import { hydrate } from 'react-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'typedi';
import '../application';
import { routes } from '../application/route';

hydrate(
  <Provider container={Container}>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
