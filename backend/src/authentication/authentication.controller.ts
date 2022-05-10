import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction, Router } from 'express';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../user/user.dto';
import userModel from './../user/user.model';
import AuthenticationService from './authentication.service';
import LogInDto from './logIn.dto';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = Router();
  public authService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  }

  private register = async (request: Request, response: Response, next: NextFunction) => {
    const userData: CreateUserDto = request.body;

    try {
      const { cookie, user } = await this.authService.register(userData);

      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  }

  private login = async (request: Request, response: Response, next: NextFunction) => {
    const logInData: LogInDto = request.body;
    const user = await this.user.findOne({ username: logInData.username });

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.get('password', null, { getters: false }),
      );

      if (isPasswordMatching) {
        const tokenData = this.authService.createToken(user);

        response.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }

  private logout = (request: Request, response: Response) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0;Path=/']);
    response.status(200).send({});
  }
}

export default AuthenticationController;
