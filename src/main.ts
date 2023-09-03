import * as express from "express";
import {AppModule} from './app.module';

const server = express()
import {http} from '@google-cloud/functions-framework'
import {ExpressAdapter} from "@nestjs/platform-express";
import {NestFactory} from "@nestjs/core";
import {Logger} from "@nestjs/common";

export const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
  app.enableCors()
  return app.init()
}
createNestServer(server)
  .then((v) => {
    if (process.env.ENVIRONMENT === "dev") {
      Logger.log(`🚀 Starting development server on http://localhost:${process.env.PORT || 3333}`)
      v.listen(process.env.PORT || 3333)
    } else {
      Logger.log('🚀 Starting production server...')
    }
  })
  .catch((err) => Logger.error('Nest broken', err))
http('apiNEST', server)

