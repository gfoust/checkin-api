import * as http from 'http';

import config from './config';

import app from './app';

// const httpServer = http.createServer(app);

// httpServer.listen(config.serverPort, () => {
//     console.log(`Listening on port ${config.serverPort}...`);
// });

app.listen(config.serverPort);
console.log(`Listening on port ${config.serverPort}...`);
