import * as express from 'express';
import * as React from 'react';
import { Container } from 'typedi';

import '../application';
// @ts-ignore
import * as mustacheExpress from 'mustache-express';
import * as path from 'path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'mobx-react';
import * as uuid from 'uuid';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { routes } from '../application/route';

const app = express();
const ROOT_PATH = process.env.ROOT_PATH;

const currentPath = path.join(ROOT_PATH, 'dist', 'server');
const publicPath = path.join(ROOT_PATH, 'dist', 'public');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', currentPath + '/views');

app.use(express.static(publicPath));

app.get('/favicon.ico', (req, res) => res.status(500).end());

app.get('*', async (request, response) => {
  const context: any = {};
  const id = uuid.v4();
  const container = Container.of(id);

  const branch = matchRoutes(routes, request.url);

  const promises = branch.map(({ route, match }: any) => {
    return route.component && route.component.loadData ? route.component.loadData(container, match) : Promise.resolve(null);
  });

  await Promise.all(promises);

  const markup = renderToString(
    <Provider container={container}>
      <StaticRouter location={request.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  Container.remove(id);
  if (context.url) {
    return response.redirect(
      context.location.pathname + context.location.search
    );
  }

  return response.render('index', { markup });
});

app.listen(2016, () => {
  // tslint:disable-next-line
  console.info("application started at 2016 port");
});
