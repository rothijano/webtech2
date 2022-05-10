import config from './config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import * as helmet from 'helmet';
import * as cors from 'cors';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(config.server.port, () => {
      console.log(`App listening on the port ${config.server.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToTheDatabase() {
    const options: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };

    mongoose.connect(`mongodb://${config.mongo.path}`, options);
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors({
      origin: "http://localhost:4200",
      credentials: true
    }));

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
