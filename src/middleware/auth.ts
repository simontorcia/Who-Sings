import { STATUS_UNAUTHORIZED } from '../constants/http.status.constants'
import { NextFunction, Request, Response } from 'express'
import Logger from '../shared/logger.lib'

const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
  Logger.debug(`Auth_Middleware :: checkApiKey :: START`)
  const api_key = req.get('api_key')
  const config_api_key = process.env.API_KEY

  if (!api_key || api_key !== config_api_key) {
    Logger.debug(`Auth_Middleware :: checkApiKey :: APIKEY NOT VALID`)

    res.statusCode = STATUS_UNAUTHORIZED
    res.end()
    return
  }
  Logger.debug(`Auth_Middleware :: checkApiKey :: APIKEY OK`)
  next()
}

export const authMiddleware = {
  checkApiKey,
}
