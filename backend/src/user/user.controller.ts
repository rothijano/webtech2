import { Router, Request, Response, NextFunction } from 'express';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import productModel from '../product/product.model';
import userModel from './user.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';

class UserController implements Controller {
  public path = '/user';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getUser);
  }

  private getUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    response.send(request.user);
  }
}

export default UserController;
