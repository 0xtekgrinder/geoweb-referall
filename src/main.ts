import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';

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

  await app.init();

  http.createServer(server).listen(process.env.PUBLIC_PORT);
  http.createServer(server).listen(process.env.PRIVATE_PORT);
}
bootstrap();
