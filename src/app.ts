import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import { mongoConnection } from './config/mongo/mongo.connections'
import gameRouter from './modules/game/game.routes'
import playerRouter from './modules/player/player.routes'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.setConfig()
    this.routes()
    mongoConnection.setConfig()
    mongoConnection.disconnect()
  }

  private setConfig() {
    //Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: '50mb' }))

    //Allows us to receive requests with data in x-www-form-urlencoded format
    // this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

    //Enables cors
    // this.app.use(cors())

    // initialize dotenv configuration
    dotenv.config()
  }

  private routes = (): void => {
    this.app.locals.baseURL = process.env.ORIGIN
    const router = express.Router()

    this.app.use('/game', gameRouter)
    this.app.use('/player', playerRouter)
  }
}

export default new App().app
