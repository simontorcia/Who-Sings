import { PORT } from './constants/constants'
import app from './app'
import Logger from './shared/logger.lib';

app.listen(PORT, () => Logger.debug(`Server is running @ http://localhost:${PORT}`))



