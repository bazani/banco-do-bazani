import express, { Application as ExApplication, Handler } from 'express';
import cors from 'cors';
import { controllers } from './controllers';
import { MetadataKeys } from './utils/metadata.keys';
import { IRouter } from './utils/decorators/handlers.decorator';

class Application {
  private readonly instance$: ExApplication;

  get instance(): ExApplication {
    return this.instance$;
  }

  constructor() {
    this.instance$ = express();
    this.instance$.use(express.json());
    this.instance$.use(cors());
    this.registerRouters();
  }

  private registerRouters() {
    this.instance$.get('/', (req, res) => {
      res.json({ mesage: 'Hello there!'});
    });

    const info: Array<{ api: string, handler: string}> = [];

    controllers.forEach((controllerClass) => {
      const controllerInstance : { [handlerName: string]: Handler } = new controllerClass() as any;

      const basePath: string = Reflect.getMetadata(MetadataKeys.BASE_PATH, controllerClass);
      const routers: IRouter[] = Reflect.getMetadata(MetadataKeys.ROUTERS, controllerClass);

      const exRouter = express.Router();

      routers.forEach(({ method, path, handlerName }) => {
        exRouter[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));

	      info.push({
	          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
          	  handler: `${controllerClass.name}.${String(handlerName)}`,
	      });
      }); 

      this.instance$.use(basePath, exRouter);
    });

    console.table(info);
  }
}

export default new Application();
