import development from './development';
import production from './production';

export interface Config {
  serverPort: number,
  db: {
    host: string;
    port: number;
    name: string;
    user?: string;
    pass?: string;
  }
}

let config: Config = {
  serverPort: 8000,
  db: {
    host: 'checkin-mongo',
    port: 27017,
    name: 'checkin',
  },
};

if (process.env.NODE_ENV) {
  Object.assign(config, production);
}
else {
  Object.assign(config, development);
}

export default config;
