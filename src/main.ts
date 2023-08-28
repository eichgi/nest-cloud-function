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
    /*if (process.env.environment === "dev") {
      Logger.log('🚀 Starting production server...')
    } else {
      Logger.log(`🚀 Starting development server on http://localhost:${process.env.PORT || 3333}`)
      v.listen(process.env.PORT || 3333)
    }*/
    // v.listen(process.env.PORT || 3333) avoiding port definition
  })
  .catch((err) => Logger.error('Nest broken', err))
http('apiNEST', server)

