import { Router } from 'express';

import AuthMiddleware from './App/Middleware/auth';

import UserController from './App/Controllers/UserController';
import LinkController from './App/Controllers/LinkController';

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.create);

routes.get('/links', AuthMiddleware, LinkController.index);
routes.post('/link', AuthMiddleware, LinkController.create);
routes.post('/link/reordenar', AuthMiddleware, LinkController.reOrder);

routes.post('/login', UserController.login);

export default routes;
