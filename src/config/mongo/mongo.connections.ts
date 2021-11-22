import { MONGO } from './mongo.config'
import mongoose from 'mongoose'
import Logger from '../../shared/logger.lib'

const setConfig = (): void => {
  mongoose.Promise = global.Promise
  mongoose.connect(MONGO.url, MONGO.configuration)
  mongoose.set('toJSON', {
    virtuals: true,
    transform: (_: any, converted: any) => {
      delete converted._id
    },
  })
}

const disconnect = () => {
  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      Logger.debug(`MongoConnection :: disconnect `)
      process.exit(0)
    })
  })
}

export const mongoConnection = { setConfig, disconnect }
