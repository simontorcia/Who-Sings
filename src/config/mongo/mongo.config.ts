import { ORIGIN } from '../../constants/constants'

export const MONGO = {
  url: `mongodb://${ORIGIN}:27017/Mongo_DB`,
  configuration: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
}
