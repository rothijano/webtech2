import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import ProductController from './product/product.controller';
import UserController from './user/user.controller';

const app = new App(
  [
    new AuthenticationController(),
    new UserController(),
    new ProductController()
  ],
);

app.listen();
