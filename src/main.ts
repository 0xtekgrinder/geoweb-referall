import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { AdminModule } from './admin/admin.module';

async function createSwaggerRouter(
  app: INestApplication,
  modules: Function[], // eslint-disable-line @typescript-eslint/ban-types
): Promise<express.Router> {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GeoWeb Referral API')
    .setVersion('1.0')
    .setDescription(
      'The GeoWeb Referral API that allows claims to be referred by users.',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: modules,
  });

  const swaggerHtml = swaggerUi.generateHTML(document);
  const router = express
    .Router()
    .use(swaggerUi.serveFiles(document))
    .get('/', (req, res) => {
      res.send(swaggerHtml);
    });

  return router;
}

async function bootstrap() {
  const server = express();

  server.use((req, res, next) => {
    req.headers['x-forwarded-host'] ??= req.headers.host;
    switch (req.socket.localPort) {
      case parseInt(process.env.PUBLIC_PORT):
        req.headers.host = 'public';
        break;
      case parseInt(process.env.PRIVATE_PORT):
        req.headers.host = 'private';
        break;
      default:
        res.sendStatus(500);
        return;
    }

    next();
  });

  server.use(
    cors({
      credentials: true,
      origin: true,
    }),
  );

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(new ValidationPipe());

  // setup swagger
  const privateSwaggerRouter = await createSwaggerRouter(app, [
    AppModule,
    AdminModule,
  ]);
  server.use('/doc', (req, res, next) => {
    switch (req.headers.host) {
      case 'public':
        res.sendStatus(404);
        return;
      case 'private':
        privateSwaggerRouter(req, res, next);
        return;
      default:
        // this shouldn't be possible
        res.sendStatus(500);
        return;
    }
  });

  await app.init();

  http.createServer(server).listen(process.env.PUBLIC_PORT);
  http.createServer(server).listen(process.env.PRIVATE_PORT);
}
bootstrap();
